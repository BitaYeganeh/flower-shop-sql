import mariadb from 'mariadb';

import sqlasetukset from './sqlasetukset.json' with {type:'json'};

// console.log(sqlasetukset);
// console.log(sqlasetukset.yhteystiedot);
// console.log(sqlasetukset.sqlLauseet.kaikkiKukat);
// console.log(sqlasetukset.sqlLauseet.kaikkiKukat.join(' '));

const sql=sqlasetukset.sqlLauseet;

const kaikkiKukatSql=sql.kaikkiKukat.join(' ');
const kaikkiPuutarhatSql=sql.kaikkiPuutarhat.join(' ');
const lisaaAsiakasSql=sql.lisaaAsiakas.join(' ');

import Tietokanta from './varastokirjasto.js';

const kanta=new Tietokanta(sqlasetukset.yhteystiedot);

// kanta.lisaa(lisaaAsiakasSql,[13,'Matti','Meri','kuja 2'])
// .then(console.log).catch(console.log);

const tilaus = {
    tilausId: 400,
    asiakasId: 24,
    tilauspvm: '2025-10-10',
    tilausrivit: [
        {
            kukkaId: 1,
            puutarhaId: 2,
            lkm: 5,
            hinta: 10
        },
        {
            kukkaId: 2,
            puutarhaId: 2,
            lkm: 1,
            hinta: 5
        }
    ]
}

kanta.lisaaTilaus(tilaus,sql).then(console.log).catch(console.log);

// const henkilodb = new Tietokanta({
//     "host": "localhost",
//     "port": 3306,
//     "user": "maria",
//     "password": "salainen",
//     "database": "henkilokanta"
// });

// henkilodb.haeKaikki('select * from henkilo').then(console.log);
// kanta.haeKaikki(kaikkiKukatSql).then(console.log);

// async function haeKaikki(sql){
//     let yhteys;
//     try{
//         yhteys=await mariadb.createConnection(sqlasetukset.yhteystiedot);
//         const tulos=await yhteys.query(sql);
//         return Promise.resolve(tulos);
//     }
//     catch(virhe){
//         console.log(virhe); //debuggausta varten
//         return Promise.resolve([]);
//     }
//     finally{
//         if(yhteys) yhteys.end();
//     }
// }


// haeKaikki(kaikkiKukatSql).then(console.log);
// haeKaikki(kaikkiPuutarhatSql).then(console.log);
