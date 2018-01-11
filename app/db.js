import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(process.cwd() + '/urls.sqlite')

export function initialize() {
  db.serialize(function () {
    db.run('CREATE TABLE urls (short TEXT, long TEXT)');
  })

  db.close();
}

export function addUrl(short, long) {
  return new Promise((resolve, reject) =>
    db.run(
      `INSERT INTO urls VALUES (?, ?)`, short, long,
      (err) => {
        if (err) {
          console.error('DB error: ', err);
          reject(err);
        } else {
          resolve();
        }
      }
    )
  );
}

export function getFullUrl(short) {
  return new Promise((resolve, reject) =>
    db.get(
      `SELECT long FROM urls WHERE short = ?`, short,
      (err, row) => {
        if (row && row.long) {
          resolve(row.long);
        } else {
          if (err) {
            console.error('DB error: ', err);
          }
          reject(err || 'URL not found');
        }
      }
    )
  );
}
