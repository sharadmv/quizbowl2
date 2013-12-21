var sphinx = require('../lib/sphinx');
sphinx.query("select * from tossup limit 5", [], function(err, rows) {
  console.log(err, rows);
});
