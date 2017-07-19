const settings = require('./settings');
// settings.json

const knex = require('knex')({
  client: 'pg',
  connection: {
    database: settings.database,
    user: settings.user,
    host: settings.hostname,
    port: settings.port,
    ssl: settings.ssl,
    password: settings.password,
  },
});

const lookup = process.argv[2];

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


knex.select('first_name', 'last_name', 'birthdate')
  .from('famous_people')
  .where('first_name', 'LIKE', lookup)
  .orWhere('last_name', 'LIKE', lookup)
  .asCallback((err, result) => {
    if (err) {
      return console.error('error running query', err);
    }
    console.log(`Found ${result.length} person(s) by the name of ${lookup}`);
    logRows(result);
    knex.destroy();
  });
