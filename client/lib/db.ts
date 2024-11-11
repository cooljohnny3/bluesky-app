import * as mariadb from 'mariadb';

if (!process.env.MYSQL_HOST) {
  throw new Error('Missing MYSQL_HOST');
}

if (!process.env.MYSQL_USER) {
  throw new Error('Missing MYSQL_USER');
}

if (!process.env.MYSQL_PASSWORD) {
  throw new Error('Missing MYSQL_PASSWORD');
}

if (!process.env.MYSQL_DATABASE) {
  throw new Error('Missing MYSQL_DATABASE');
}

const pool = mariadb.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export default pool;
