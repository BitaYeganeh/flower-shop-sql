import path from 'node:path';
import express from 'express';
import cors from 'cors';

import config from './config.json' with {type:'json'}
const {port,host}=config;

import sqlasetukset from './sqlasetukset.json' with {type:'json'};
const {yhteystiedot,sqlLauseet} = sqlasetukset;

import Tietokanta from './varastokirjasto.js';

const kukkakauppa=new Tietokanta(yhteystiedot);

//määritellään JUURI-kansio (commonjs __dirname)
import { fileURLToPath } from 'node:url';
const JUURI = fileURLToPath(new URL('.', import.meta.url));

// console.log(JUURI)

const app=express();

app.use(express.json());
app.use(cors()); //ei tässä esimerkissä välttämätön

app.use(express.static(path.join(JUURI,'public')));

app.get('/', (req,res)=>res.sendFile(
        path.join(JUURI,'public','sivut','valikko.html')));

app.get('/kukat', (req,res)=>{
    const kaikkiKukatSql=sqlLauseet.kaikkiKukat.join(' ');
    kukkakauppa.haeKaikki(kaikkiKukatSql)
        .then(tulos=>res.json(tulos));
});
app.get('/puutarhat', (req, res) => {
    const kaikkiPuutarhatSql = sqlLauseet.kaikkiPuutarhat.join(' ');
    kukkakauppa.haeKaikki(kaikkiPuutarhatSql)
        .then(tulos => res.json(tulos));
});

app.get('/puutarhalista', (req,res)=>{
    const puutarhalistaSql = sqlLauseet.puutarhalista.join(' ');
    kukkakauppa.haeKaikki(puutarhalistaSql)
        .then(tulos=>res.json(tulos));
});

app.get('/puutarhankukat/:id', (req,res)=>{
    const puutarhanNro=req.params.id;
    const puutarhankukatSql=sqlLauseet.puutarhanKukat.join(' ');
    kukkakauppa.hae(puutarhankukatSql,[puutarhanNro])
        .then(tulos=>res.json(tulos));
});

app.get('/kukkalista/:pid', (req, res) => {
    const puutarhanNro = req.params.pid;
    const kukkalistaSql = sqlLauseet.kukkalista.join(' ');
    kukkakauppa.hae(kukkalistaSql, [puutarhanNro])
        .then(tulos => res.json(tulos));
});

app.post('/uusiasiakas', (req,res)=>{
    const asiakas=req.body;
    const data=[asiakas.asiakasId, asiakas.etunimi, asiakas.sukunimi, asiakas.osoite];
    const lisaaAsiakasSql=sqlLauseet.lisaaAsiakas.join(' ');
    kukkakauppa.lisaa(lisaaAsiakasSql, data)
        .then(tulos=>res.json(tulos))
        .catch(virhe=>res.json(virhe));
});


app.listen(port,host, ()=>console.log(`${host}:${port} palvelee...`));