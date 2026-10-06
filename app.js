import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

import sqlasetukset from './sqlasetukset.json' with { type: 'json' };
import Tietokanta, { Kayttajavirhe } from './varastokirjasto.js';

const { sqlLauseet } = sqlasetukset;
const sql = (nimi) => sqlLauseet[nimi].join(' ');
const JUURI = fileURLToPath(new URL('.', import.meta.url));

// Builds the Express app; the database settings come from the caller,
// so the tests can point it at a separate test database
export function luoSovellus(yhteystiedot) {
    const kukkakauppa = new Tietokanta(yhteystiedot);
    const app = express();

    app.use(express.json());
    app.use(express.static(path.join(JUURI, 'public')));

    // Wraps async routes so database errors reach the error handler
    const reitti = (kasittelija) => (req, res, next) =>
        Promise.resolve(kasittelija(req, res)).catch(next);

    app.get('/', (req, res) =>
        res.sendFile(path.join(JUURI, 'public', 'sivut', 'valikko.html')));

    app.get('/kukat', reitti(async (req, res) =>
        res.json(await kukkakauppa.haeKaikki(sql('kaikkiKukat')))));

    app.get('/puutarhat', reitti(async (req, res) =>
        res.json(await kukkakauppa.haeKaikki(sql('kaikkiPuutarhat')))));

    app.get('/puutarhalista', reitti(async (req, res) =>
        res.json(await kukkakauppa.haeKaikki(sql('puutarhalista')))));

    app.get('/puutarhankukat/:id', reitti(async (req, res) =>
        res.json(await kukkakauppa.hae(sql('puutarhanKukat'), [req.params.id]))));

    app.get('/kukkalista/:pid', reitti(async (req, res) =>
        res.json(await kukkakauppa.hae(sql('kukkalista'), [req.params.pid]))));

    app.get('/tilaustiedot/:pid/:kid', reitti(async (req, res) => {
        const [tiedot] = await kukkakauppa.hae(sql('tilaustiedot'), [req.params.pid, req.params.kid]);
        if (!tiedot) throw new Kayttajavirhe('Kukkaa ei löydy tästä puutarhasta.', 404);
        res.json(tiedot);
    }));

    app.get('/asiakkaat', reitti(async (req, res) =>
        res.json(await kukkakauppa.haeKaikki(sql('asiakkaat')))));

    app.post('/uusiasiakas', reitti(async (req, res) => {
        const { asiakasId, etunimi, sukunimi, osoite } = req.body ?? {};
        if (!Number.isInteger(Number(asiakasId)) || Number(asiakasId) < 1
            || !etunimi?.trim() || !sukunimi?.trim() || !osoite?.trim()) {
            throw new Kayttajavirhe('Täytä kaikki kentät (numero, etunimi, sukunimi, osoite).');
        }
        const tulos = await kukkakauppa.lisaa(sql('lisaaAsiakas'),
            [Number(asiakasId), etunimi.trim(), sukunimi.trim(), osoite.trim()]);
        res.status(201).json(tulos);
    }));

    app.get('/tilaukset', reitti(async (req, res) =>
        res.json(await kukkakauppa.haeKaikki(sql('tilaukset')))));

    app.post('/tilaus', reitti(async (req, res) => {
        const tulos = await kukkakauppa.lisaaTilaus(req.body, sqlLauseet);
        res.status(201).json({ viesti: `Tilaus ${tulos.tilausId} vastaanotettu.`, tyyppi: 'info', ...tulos });
    }));

    // One place for errors: user mistakes get their message,
    // database problems a general one (details go to the server log)
    app.use((virhe, req, res, next) => {
        if (virhe instanceof Kayttajavirhe) {
            return res.status(virhe.status).json({ viesti: virhe.message, tyyppi: 'virhe' });
        }
        console.error(virhe);
        res.status(500).json({ viesti: 'Tietokantavirhe. Yritä myöhemmin uudelleen.', tyyppi: 'virhe' });
    });

    return app;
}
