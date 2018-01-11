import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(process.cwd() + '/urls.sqlite')

export function initialize() {
  db.serialize(function () {
    db.run('CREATE TABLE urls (short TEXT, long TEXT)')
  })

  db.close()
}

export function addUrl(short, long) {
  db.run(`INSERT INTO urls VALUES (?, ?)`, short, long)
}

export function getFullUrl(short) {
  return new Promise((resolve, reject) =>
    db.get(
      `SELECT long FROM urls WHERE urls.short = ?`,
      short,
      (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      }
    )
  )
}
