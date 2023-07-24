const
  express = require('express'),
  serveStatic = require('serve-static'),
  port = process.env.PORT || 5000

const app = express()

// attackers can use this header to detect apps running Express
// and then launch specifically-targeted attacks
app.disable('x-powered-by')

app.use(serveStatic('../dist'))
app.use('/', (req, res) => {
  console.log(req)
  console.log(res)
  var printer = require("../lib"),
  util = require('util');
  console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));
})
app.listen(port)
