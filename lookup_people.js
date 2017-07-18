const pg = require('pg');
const settings = require('./settings');
 // settings.json
const lookup = process.argv[2].toUpperCase();
console.log(lookup);

const client = new pg.Client({
  user: settings.user,
  password: settings.password,
  database: settings.database,
  host: settings.hostname,
  port: settings.port,
  ssl: settings.ssl,
});

// HELPER FUNCTIONS


function convertDateTimeToDate(dateTime) {
  const day = (`0${dateTime.getDate()}`).slice(-2);
  const month = (`0${dateTime.getMonth() + 1}`).slice(-2);
  const year = dateTime.getFullYear();

  return (`${year}-${month}-${day}`);
}

function logRows(tableRowsArray) {
  let index = 1;
  tableRowsArray.forEach((row) => {
    console.log(`- ${index}: ${row.first_name} ${row.last_name}, born ${convertDateTimeToDate(row.birthdate)}`);
    index += 1;
  });
}

// CLIENT QUERY

client.connect((err) => {
  if (err) {
    return console.error('Connection Error', err);
  }
  console.log('Searching...');
  client.query(`SELECT first_name, last_name, birthdate
                  FROM famous_people 
                  WHERE (UPPER(first_name) LIKE '${lookup}' OR UPPER(last_name) LIKE '${lookup}');`,
    (err, result) => {
      if (err) {
        return console.error('error running query', err);
      }
      console.log(`Found ${result.rows.length} person(s) by the name of ${lookup}`);
      logRows(result.rows);
      client.end();
    });
});
