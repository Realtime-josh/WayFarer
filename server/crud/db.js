import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
let connectionString = process.env.DATABASE_URL;

if (process.env.current_env === 'test') {
  connectionString = process.env.TEST_DATABASE_URL;
}
// let connectionString;
// connectionString = process.env.TEST_DATABASE_URL;
// if (process.env.NODE_ENV === 'production') {
//   connectionString = process.env.DATABASE_URL;
// }

const usersTable = 'users';
// const busesTable = 'bus';
// const tripTable = 'trips';
// const bookingTable = 'bookings';

const getUserEmail = email => new Promise((resolve, reject) => {
  const client = new Client(connectionString);
  client.connect()
    .then(() => {
      const sql = `SELECT * FROM ${usersTable} WHERE user_email=$1`;
      const params = [email];
      client.query(sql, params)
        .then((result) => {
          resolve(result.rows);
          client.end();
        }).catch((e) => {
          reject(e);
        });
    }).catch((e) => {
      reject(e);
    });
});

const insertUsers = (firstName, lastName,
  email, password, isAdmin) => new Promise((resolve, reject) => {
  const client = new Client(connectionString);
  client.connect()
    .then(() => {
      const sql = `INSERT INTO ${usersTable}(first_name,last_name,user_email,password,is_admin)VALUES($1,$2,$3,$4,$5)`;
      const params = [firstName, lastName, email, password, isAdmin];
      client.query(sql, params)
        .then((result) => {
          resolve(result.rows);
          client.end();
        }).catch((e) => {
          reject(e);
        });
    }).catch((e) => {
      reject(e);
    });
});

const clearTable = () => new Promise((resolve, reject) => {
  const client = new Client(connectionString);
  client.connect()
    .then(() => {
      const sql = `DELETE FROM ${usersTable};`;
      client.query(sql)
        .then((result) => {
          resolve(result.rowCount);
          client.end();
        })
        .catch(e => reject(e));
    }).catch(e => reject(e));
});

export { getUserEmail, insertUsers, clearTable };
