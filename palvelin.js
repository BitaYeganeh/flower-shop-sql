import { luoSovellus } from './app.js';

// Settings come from .env (see .env.example) so no password is in the code
const yhteystiedot = {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'kauppias',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? 'kukkakauppa',
};

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? 'localhost';

luoSovellus(yhteystiedot).listen(port, host, () =>
    console.log(`Kukkakauppa: http://${host}:${port}`));
