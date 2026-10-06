// API tests against a real MariaDB test database (kukkakauppa_test).
// Each run rebuilds the tables and sample data, so results are repeatable.
import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import mariadb from 'mariadb';
import { luoSovellus } from '../app.js';

const yhteystiedot = {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'kauppias',
    password: process.env.DB_PASSWORD ?? '1234',
    database: process.env.TEST_DB_NAME ?? 'kukkakauppa_test',
};

let palvelin;
let osoite;

async function alustaTietokanta() {
    const yhteys = await mariadb.createConnection({ ...yhteystiedot, multipleStatements: true });
    try {
        await yhteys.query(await readFile(new URL('../database/schema.sql', import.meta.url), 'utf8'));
        await yhteys.query(await readFile(new URL('../database/sample-data.sql', import.meta.url), 'utf8'));
    } finally {
        await yhteys.end();
    }
}

async function kysy(sql, parametrit = []) {
    const yhteys = await mariadb.createConnection(yhteystiedot);
    try {
        return await yhteys.query(sql, parametrit);
    } finally {
        await yhteys.end();
    }
}

const hae = (polku) => fetch(osoite + polku);
const laheta = (polku, data) => fetch(osoite + polku, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
});

before(async () => {
    palvelin = luoSovellus(yhteystiedot).listen(0);
    await new Promise((resolve) => palvelin.once('listening', resolve));
    osoite = `http://127.0.0.1:${palvelin.address().port}`;
});

beforeEach(alustaTietokanta);

after(() => palvelin.close());

test('lists all flowers with their growing place', async () => {
    const res = await hae('/kukat');
    assert.equal(res.status, 200);
    const kukat = await res.json();
    assert.equal(kukat.length, 6);
    assert.deepEqual(Object.keys(kukat[0]).sort(), ['kukanNimi', 'kukkaId', 'paikanKuvaus', 'paikanTyyppi']);
});

test('lists the flowers of one garden', async () => {
    const res = await hae('/puutarhankukat/1');
    assert.equal(res.status, 200);
    const kukat = await res.json();
    assert.ok(kukat.length > 0);
    assert.ok(kukat.every((k) => k.puutarhanNimi === 'Orvokin tulppaanit oy'));
});

test('returns price and stock for a flower in a garden', async () => {
    const res = await hae('/tilaustiedot/1/2');
    assert.equal(res.status, 200);
    const tiedot = await res.json();
    assert.equal(tiedot.kukanNimi, 'Tulppaani');
    assert.equal(tiedot.yksikkohinta, 2);
});

test('answers 404 for a flower the garden does not sell', async () => {
    const res = await hae('/tilaustiedot/1/999');
    assert.equal(res.status, 404);
});

test('adds a customer and rejects the same customer number twice', async () => {
    const asiakas = { asiakasId: 500, etunimi: 'Testi', sukunimi: 'Asiakas', osoite: 'Testikatu 1' };
    assert.equal((await laheta('/uusiasiakas', asiakas)).status, 201);
    const toinen = await laheta('/uusiasiakas', asiakas);
    assert.equal(toinen.status, 409);
});

test('rejects a customer with missing fields', async () => {
    const res = await laheta('/uusiasiakas', { asiakasId: 501, etunimi: 'Ilman' });
    assert.equal(res.status, 400);
});

test('saves an order with prices from the database and reduces stock', async () => {
    const [{ asiakasId }] = await kysy('select asiakasId from asiakas limit 1');
    const [ennen] = await kysy('select varasto, yksikkohinta from puutarhan_kukat where puutarhaId=1 and kukkaId=2');

    // The browser's price is ignored on purpose
    const res = await laheta('/tilaus', {
        asiakasId,
        tilausrivit: [{ puutarhaId: 1, kukkaId: 2, lkm: 2, hinta: 0 }],
    });
    assert.equal(res.status, 201);
    const tulos = await res.json();
    assert.equal(tulos.summa, 2 * ennen.yksikkohinta);

    const [rivi] = await kysy('select lkm, hinta from tilauksen_kukat where tilausId=?', [tulos.tilausId]);
    assert.equal(rivi.hinta, ennen.yksikkohinta);
    const [jalkeen] = await kysy('select varasto from puutarhan_kukat where puutarhaId=1 and kukkaId=2');
    assert.equal(jalkeen.varasto, ennen.varasto - 2);
});

test('rolls back the whole order when one line fails', async () => {
    const [{ asiakasId }] = await kysy('select asiakasId from asiakas limit 1');
    const [{ tilauksia }] = await kysy('select count(*) as tilauksia from tilaus');
    const [ennen] = await kysy('select varasto from puutarhan_kukat where puutarhaId=1 and kukkaId=2');

    // First line is fine, second asks for more than is in stock
    const liikaa = await laheta('/tilaus', {
        asiakasId,
        tilausrivit: [
            { puutarhaId: 1, kukkaId: 2, lkm: 1 },
            { puutarhaId: 2, kukkaId: 1, lkm: 100000 },
        ],
    });
    assert.equal(liikaa.status, 400);
    assert.match((await liikaa.json()).viesti, /Varastossa on vain/);

    // Nothing was saved and no stock was used
    const [{ tilauksia: nyt }] = await kysy('select count(*) as tilauksia from tilaus');
    assert.equal(Number(nyt), Number(tilauksia));
    const [jalkeen] = await kysy('select varasto from puutarhan_kukat where puutarhaId=1 and kukkaId=2');
    assert.equal(jalkeen.varasto, ennen.varasto);
});

test('rejects an order for an unknown customer or without lines', async () => {
    assert.equal((await laheta('/tilaus', { asiakasId: 999999, tilausrivit: [{ puutarhaId: 1, kukkaId: 2, lkm: 1 }] })).status, 400);
    assert.equal((await laheta('/tilaus', { asiakasId: 1, tilausrivit: [] })).status, 400);
});

test('lists orders with their totals', async () => {
    const res = await hae('/tilaukset');
    assert.equal(res.status, 200);
    const tilaukset = await res.json();
    assert.ok(tilaukset.length > 0);
    assert.ok('summa' in tilaukset[0]);
});
