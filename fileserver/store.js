const {Pool} = require('pg');
const config = require('./config');

const tables = [
  `
    create table if not exists file_areas (
      id serial primary key,
      uuid char(36) not null,
      name text not null unique
    )
  `, `
    create table if not exists object_stores (
      id serial primary key,
      url text
    )
  `, `
    create table if not exists object_store_list (
      file_area_id integer references file_areas (id),
      object_store_id integer references object_stores (id)
    )
  `
];

const queries = {
  fileAreasList: 'SELECT id, uuid, name FROM file_areas;',
  fileAreaGet: `
    SELECT
      id, uuid, name
    FROM
      file_areas
    WHERE
      name = $1;
  `,
  fileAreaCreate: `
    insert into
      file_areas
      (uuid, name)
    values
      ($1, $2)
    returning
      id;
  `
};

class Store {
  constructor() {
    this.pool = new Pool({
      host: config.get('database:host'),
      port: config.get('database:port'),
      database: config.get('database:database'),
      user: config.get('database:user'),
      password: config.get('database:password'),
      connectionTimeoutMillis: config.get('database:connectionTimeoutMillis'),
      idleTimeoutMillis: config.get('database:idleTimeoutMillis'),
      max: config.get('database:maxClients')
    });

    this.pool.on('error', (err, client) => {
      // No action should be needed, but logging the error may be helpful for
      // diagnosing bugs.
      console.error('Error on idle database client', err, client);
    });
  }

  async end() {
    return this.pool.end().then(() => {
      console.log('closed connections to database');
    });
  }

  async init() {
    console.log('creating tables');
    tables.forEach(async table => {
      console.log(table);
      await this.pool.query(table);
    });
  }

  async query(name, args) {
    return (await this.pool.query(
      {name, text: queries[name], values: args}
    )).rows;
  }

  async get() {
    return this.query('SELECT * FROM file_areas WHERE id = $1', []);
  }
}

module.exports = {Store};
