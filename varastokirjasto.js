import mariadb from 'mariadb';

// Error with an HTTP status, for problems the user can fix (bad input)
export class Kayttajavirhe extends Error {
    constructor(viesti, status = 400) {
        super(viesti);
        this.status = status;
    }
}

export default class Tietokanta {
    #yhteystiedot;

    constructor(yhteystiedot) {
        this.#yhteystiedot = yhteystiedot;
    }

    async #yhteys() {
        return mariadb.createConnection(this.#yhteystiedot);
    }

    // Errors are thrown to the caller (the API answers 500) instead of
    // being hidden behind an empty list
    async haeKaikki(sql) {
        return this.hae(sql, []);
    }

    async hae(sql, parametrit) {
        const yhteys = await this.#yhteys();
        try {
            return await yhteys.query(sql, parametrit);
        } finally {
            await yhteys.end();
        }
    }

    async lisaa(sql, parametrit) {
        const yhteys = await this.#yhteys();
        try {
            await yhteys.query(sql, parametrit);
            return { viesti: 'lisäys onnistui', tyyppi: 'info' };
        } catch (virhe) {
            if (virhe.code === 'ER_DUP_ENTRY') {
                throw new Kayttajavirhe('Tällä numerolla on jo asiakas.', 409);
            }
            throw virhe;
        } finally {
            await yhteys.end();
        }
    }

    /**
     * Saves an order in ONE transaction on ONE connection.
     * The course version opened a new connection for every row, so the
     * rollback could not undo anything. Prices come from the database,
     * never from the browser, and stock is checked and reduced.
     *
     * tilaus = { asiakasId, tilausrivit: [{ puutarhaId, kukkaId, lkm }] }
     */
    async lisaaTilaus(tilaus, sqlLauseet) {
        const sql = (nimi) => sqlLauseet[nimi].join(' ');
        const { asiakasId, tilausrivit } = tilaus ?? {};

        if (!Number.isInteger(Number(asiakasId))) {
            throw new Kayttajavirhe('Valitse asiakas.');
        }
        if (!Array.isArray(tilausrivit) || tilausrivit.length === 0) {
            throw new Kayttajavirhe('Tilauksessa ei ole yhtään riviä.');
        }

        // Same flower from the same garden twice -> one row with the sum
        const rivit = new Map();
        for (const rivi of tilausrivit) {
            const lkm = Number(rivi.lkm);
            if (!Number.isInteger(lkm) || lkm < 1) {
                throw new Kayttajavirhe('Määrän pitää olla vähintään 1.');
            }
            const avain = `${rivi.puutarhaId}-${rivi.kukkaId}`;
            const vanha = rivit.get(avain);
            rivit.set(avain, {
                puutarhaId: Number(rivi.puutarhaId),
                kukkaId: Number(rivi.kukkaId),
                lkm: (vanha?.lkm ?? 0) + lkm,
            });
        }

        const yhteys = await this.#yhteys();
        try {
            await yhteys.beginTransaction();

            const asiakas = await yhteys.query(sql('asiakasOlemassa'), [asiakasId]);
            if (asiakas.length === 0) {
                throw new Kayttajavirhe('Asiakasta ei löydy.');
            }

            const [{ seuraava }] = await yhteys.query(sql('seuraavaTilausId'));
            const tilausId = Number(seuraava);
            await yhteys.query(sql('lisaaTilaus'), [tilausId, asiakasId, new Date()]);

            let summa = 0;
            for (const rivi of rivit.values()) {
                const [varasto] = await yhteys.query(sql('varastoJaHinta'), [rivi.puutarhaId, rivi.kukkaId]);
                if (!varasto) {
                    throw new Kayttajavirhe('Valittua kukkaa ei myydä tässä puutarhassa.');
                }
                if (varasto.varasto < rivi.lkm) {
                    throw new Kayttajavirhe(`Varastossa on vain ${varasto.varasto} kpl.`);
                }
                await yhteys.query(sql('lisaaTilausrivi'),
                    [tilausId, rivi.kukkaId, rivi.puutarhaId, rivi.lkm, varasto.yksikkohinta]);
                await yhteys.query(sql('vahennaVarastoa'), [rivi.lkm, rivi.puutarhaId, rivi.kukkaId]);
                summa += rivi.lkm * varasto.yksikkohinta;
            }

            await yhteys.commit();
            return { tilausId, summa };
        } catch (virhe) {
            await yhteys.rollback();
            throw virhe;
        } finally {
            await yhteys.end();
        }
    }
}
