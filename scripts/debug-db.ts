import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        const resUsers = await client.query('SELECT id, email, role FROM "user"');
        console.log('Users found:', resUsers.rows);

    } catch (err) {
        console.error('Error connecting or querying:', err);
    } finally {
        await client.end();
    }
}

main();
