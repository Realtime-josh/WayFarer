import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
let connectionString;
connectionString = process.env.TEST_DATABASE_URL;
connectionString = process.env.TEST_DATABASE_URL;
if (process.env.NODE_ENV === 'production') {
  connectionString = process.env.DATABASE_URL;
} else if (process.env.current_env === 'test') {
  connectionString = process.env.TEST_DATABASE_URL;
}

const usersTable = 'users';
const tripsTable = 'trips';
const bookingTable = 'bookings';

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

const createTrip = details => new Promise((resolve, reject) => {
  const client = new Client(connectionString);
  client.connect()
    .then(() => {
      const sql = `INSERT INTO ${tripsTable}
      (bus_id,origin,destination,trip_date,trip_time,fare)VALUES($1,$2,$3,$4,$5,$6)`;
      const params = [details.busId, details.origin,
        details.destination, details.tripDate, details.tripTime, details.fare];
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

const getTrip = tripId => new Promise((resolve, reject) => {
  const client = new Client(connectionString);
  client.connect()
    .then(() => {
      const sql = `SELECT * FROM ${tripsTable} WHERE trip_id=$1`;
      const params = [tripId];
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

const getAllTrips = () => new Promise((resolve, reject) => {
  const client = new Client(connectionString);
  client.connect()
    .then(() => {
      const sql = `SELECT * FROM ${tripsTable}`;
      client.query(sql)
        .then((result) => {
          resolve(result.rows);
        }).catch((e) => {
          reject(e);
        });
    }).catch((e) => {
      reject(e);
    });
});

const bookingCheck = (tripId, seatNumber) => new Promise((resolve, reject) => {
  const client = new Client(connectionString);
  client.connect()
    .then(() => {
      const sql = `SELECT * FROM ${bookingTable} WHERE trip_id=$1 AND seat_number=$2`;
      const params = [tripId, seatNumber];
      client.query(sql, params)
        .then((result) => {
          resolve(result.rows);
        }).catch((e) => {
          reject(e);
        });
    }).catch((e) => {
      reject(e);
    });
});

const bookingData = data => new Promise((resolve, reject) => {
  const client = new Client(connectionString);
  client.connect()
    .then(() => {
      const sql = `INSERT INTO ${bookingTable}(trip_id,user_id,created_on,seat_number)
      VALUES($1,$2,$3,$4)`;
      const params = [data.tripId, data.userId, data.date, data.seatNumber];
      client.query(sql, params)
        .then((result) => {
          resolve(result.rows);
        }).catch((e) => {
          reject(e);
        });
    }).catch((e) => {
      reject(e);
    });
});

const cancelTrip = tripId => new Promise((resolve, reject) => {
  const client = new Client(connectionString);
  client.connect()
    .then(() => {
      const sql = `UPDATE ${tripsTable} SET status=false WHERE trip_id=$1`;
      const params = [tripId];
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

const clearTripTable = () => new Promise((resolve, reject) => {
  const client = new Client(connectionString);
  client.connect()
    .then(() => {
      const sql = `DELETE FROM ${tripsTable};`;
      client.query(sql)
        .then((result) => {
          resolve(result.rowCount);
          client.end();
        })
        .catch(e => reject(e));
    }).catch(e => reject(e));
});

const clearBookingTable = () => new Promise((resolve, reject) => {
  const client = new Client(connectionString);
  client.connect()
    .then(() => {
      const sql = `DELETE FROM ${bookingTable};`;
      client.query(sql)
        .then((result) => {
          resolve(result.rowCount);
          client.end();
        })
        .catch(e => reject(e));
    }).catch(e => reject(e));
});

const dummyTrip = (tripId, busId, origin, destination,
  tripDate, tripTime, fare, status) => new Promise((resolve, reject) => {
  const client = new Client(connectionString);
  client.connect()
    .then(() => {
      const sql = `INSERT INTO trips
      (trip_id,bus_id,origin,destination,trip_date,trip_time,fare,status)VALUES($1,$2,$3,$4,$5,$6,$7,$8)`;
      const params = [tripId, busId, origin,
        destination, tripDate, tripTime, fare, status];
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


export {
  getUserEmail, insertUsers, clearTable,
  createTrip, getTrip, cancelTrip, clearTripTable,
  getAllTrips, bookingCheck, bookingData, clearBookingTable,
  dummyTrip,
};
