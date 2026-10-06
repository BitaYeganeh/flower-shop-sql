import { muodostaLista } from '/js/apufunktiot.js';

const tilausrivit = []; // { puutarhaId, kukkaId, kukanNimi, puutarhanNimi, lkm, yksikkohinta, varasto }
let valittuKukka = null;

const $ = (id) => document.getElementById(id);
const euro = (summa) => `${summa} €`;

document.addEventListener('DOMContentLoaded', aloita);

async function aloita() {
    muodostaLista($('asiakaslista'), await haeJson('/asiakkaat'), 'asiakasId', 'sukunimi',
        (a) => `${a.etunimi} ${a.sukunimi} (nro ${a.asiakasId})`);
    muodostaLista($('puutarhalista'), await haeJson('/puutarhalista'), 'puutarhaId', 'puutarhanNimi');

    $('puutarhalista').addEventListener('change', muodostaKukkalista);
    $('kukkalista').addEventListener('change', haeKukantiedot);
    $('lisaarivi').addEventListener('click', lisaaRivi);
    $('laheta').addEventListener('click', lahetaTilaus);
    $('asiakaslista').addEventListener('change', paivitaLahetysnappi);
}

async function haeJson(osoite) {
    const vastaus = await fetch(osoite);
    if (!vastaus.ok) throw new Error((await vastaus.json()).viesti);
    return vastaus.json();
}

async function muodostaKukkalista() {
    const puutarhaId = $('puutarhalista').value;
    const kukkalista = $('kukkalista');
    kukkalista.replaceChildren(new Option(puutarhaId ? 'Valitse kukka…' : 'Valitse ensin puutarha', ''));
    kukkalista.disabled = !puutarhaId;
    valitseKukka(null);
    if (puutarhaId) {
        muodostaLista(kukkalista, await haeJson(`/kukkalista/${puutarhaId}`), 'kukkaId', 'kukanNimi');
    }
}

async function haeKukantiedot() {
    const kukkaId = $('kukkalista').value;
    if (!kukkaId) return valitseKukka(null);
    valitseKukka(await haeJson(`/tilaustiedot/${$('puutarhalista').value}/${kukkaId}`));
}

function valitseKukka(tiedot) {
    valittuKukka = tiedot;
    $('kukantiedot').textContent = tiedot
        ? `${tiedot.kukanNimi}: ${euro(tiedot.yksikkohinta)} / kpl · varastossa ${tiedot.varasto} kpl`
        : '';
    $('maara').disabled = !tiedot || tiedot.varasto === 0;
    $('maara').max = tiedot?.varasto ?? '';
    $('lisaarivi').disabled = !tiedot || tiedot.varasto === 0;
}

function lisaaRivi() {
    const lkm = Number($('maara').value);
    const k = valittuKukka;
    const jo = tilausrivit.find((r) => r.kukkaId === k.kukkaId && r.puutarhaId === Number($('puutarhalista').value));
    const yhteensa = lkm + (jo?.lkm ?? 0);

    if (!Number.isInteger(lkm) || lkm < 1) return naytaViesti('Määrän pitää olla vähintään 1.', 'virhe');
    if (yhteensa > k.varasto) return naytaViesti(`Varastossa on vain ${k.varasto} kpl.`, 'virhe');

    if (jo) jo.lkm = yhteensa;
    else tilausrivit.push({ ...k, puutarhaId: Number($('puutarhalista').value), lkm });
    naytaViesti('');
    piirraTilaus();
}

function piirraTilaus() {
    const runko = $('tilausrivit');
    runko.replaceChildren();
    if (tilausrivit.length === 0) {
        runko.innerHTML = '<tr><td colspan="6" class="tyhja">Tilauksessa ei ole vielä kukkia.</td></tr>';
    }
    tilausrivit.forEach((r, i) => {
        const tr = document.createElement('tr');
        for (const [arvo, luokka] of [[r.kukanNimi], [r.puutarhanNimi], [r.lkm, 'num'],
            [euro(r.yksikkohinta), 'num'], [euro(r.lkm * r.yksikkohinta), 'num']]) {
            const td = document.createElement('td');
            td.textContent = arvo;
            if (luokka) td.className = luokka;
            tr.appendChild(td);
        }
        const poista = document.createElement('button');
        poista.textContent = 'Poista';
        poista.className = 'pieni-nappi';
        poista.addEventListener('click', () => { tilausrivit.splice(i, 1); piirraTilaus(); });
        const td = document.createElement('td');
        td.appendChild(poista);
        tr.appendChild(td);
        runko.appendChild(tr);
    });
    $('summa').textContent = euro(tilausrivit.reduce((s, r) => s + r.lkm * r.yksikkohinta, 0));
    paivitaLahetysnappi();
}

function paivitaLahetysnappi() {
    $('laheta').disabled = tilausrivit.length === 0 || !$('asiakaslista').value;
}

async function lahetaTilaus() {
    $('laheta').disabled = true;
    const vastaus = await fetch('/tilaus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            asiakasId: Number($('asiakaslista').value),
            tilausrivit: tilausrivit.map(({ puutarhaId, kukkaId, lkm }) => ({ puutarhaId, kukkaId, lkm })),
        }),
    });
    const tulos = await vastaus.json();
    if (vastaus.ok) {
        naytaViesti(`${tulos.viesti} Summa ${euro(tulos.summa)}.`, 'info');
        tilausrivit.length = 0;
        piirraTilaus();
        await haeKukantiedot(); // stock changed
    } else {
        naytaViesti(tulos.viesti, 'virhe');
        paivitaLahetysnappi();
    }
}

function naytaViesti(teksti, tyyppi = 'info') {
    $('viestialue').textContent = teksti;
    $('viestialue').className = teksti ? `viesti viesti--${tyyppi}` : '';
}
