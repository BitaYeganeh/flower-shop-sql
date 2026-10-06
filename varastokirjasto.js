import mariadb from 'mariadb';

export default class Tietokanta{
    #yhteystiedot

    constructor(yhteystiedot){
        this.#yhteystiedot=yhteystiedot;
    }

    async haeKaikki(sql) {
        let yhteys;
        try {
            yhteys = await mariadb.createConnection(this.#yhteystiedot);
            const tulos = await yhteys.query(sql);
            return Promise.resolve(tulos);
        }
        catch (virhe) {
            console.log(virhe); //debuggausta varten
            return Promise.resolve([]);
        }
        finally {
            if (yhteys) yhteys.end();
        }
    }

    async hae(sql,parametrit) {
        let yhteys;
        try {
            yhteys = await mariadb.createConnection(this.#yhteystiedot);
            const tulos = await yhteys.query(sql,parametrit);
            return Promise.resolve(tulos);
        }
        catch (virhe) {
            console.log(virhe); //debuggausta varten
            return Promise.resolve([]);
        }
        finally {
            if (yhteys) yhteys.end();
        }
    } //hae loppu

    async lisaa(sql, parametrit){
        let yhteys;
        try {
            yhteys = await mariadb.createConnection(this.#yhteystiedot);
            await yhteys.query(sql, parametrit);
            return Promise.resolve({viesti:'lisäys onnistui', tyyppi:'info'});
        }
        catch (virhe) {
            // console.log(virhe); //debuggausta varten
            return Promise.reject({viesti:'tapahtui virhe', tyyppi:'virhe'});
        }
        finally {
            if (yhteys) yhteys.end();
        }
    }//lisaa loppu

    // const tilaus = {
    //     tilausId: 100,
    //     asiakasId: 24,
    //     tilauspvm: '2025-10-10',
    //     tilausrivit: [
    //         {
    //             kukkaId: 1,
    //             puutarhaId: 2,
    //             lkm: 5,
    //             hinta: 10
    //         }
    //     ]
    // }

    async lisaaTilaus(tilausolio, sqlLauseet) {
        let yhteys;
        const lisaaTilausSql =sqlLauseet.lisaaTilaus.join(' ');
        const lisaaTilausriviSql = sqlLauseet.lisaaTilausrivi.join(' ');

        const { tilausId, asiakasId, tilauspvm, tilausrivit }=tilausolio;


        try {
            yhteys = await mariadb.createConnection(this.#yhteystiedot);
            await yhteys.query('start transaction');
            await this.lisaa(lisaaTilausSql,[tilausId,asiakasId,tilauspvm]);

            for(const rivi of tilausrivit){
                console.log(rivi)
                await this.lisaa(lisaaTilausriviSql,
                    [tilausId, rivi.kukkaId,rivi.puutarhaId,rivi.lkm, rivi.hinta]);
            }

            await yhteys.query('commit');
            return Promise.resolve({ viesti: 'lisäys onnistui', tyyppi: 'info' });
        }
        catch (virhe) {
            await yhteys.query('rollback');
            console.log(virhe); //debuggausta varten
            return Promise.reject({ viesti: 'tapahtui virhe', tyyppi: 'virhe' });
        }
        finally {
            if (yhteys) yhteys.end();
        }
    }

} //luokan loppu