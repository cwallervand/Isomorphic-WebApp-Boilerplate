'use strict';
// require("babel/polyfill");

let Express = require('express');
let app = Express();
let React = require('react');
let MainComponent = React.createFactory(require('./dest/js/components/MyApp'));
const PORT = 8080;

// Set view paths
app.set('views', './src/views')

// Set view engine
app.set('view engine', 'ejs');

app.use("/dest", Express.static(__dirname + '/dest'));

// Routing
app.get('/', (req, res) => {
  res.render('index', {
    main: React.renderToString(MainComponent())
  });
});

let server = app.listen(PORT, () => {

  let host = server.address().address;
  let port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);

});
