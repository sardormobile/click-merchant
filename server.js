const express = require("express");
const cors = require("cors");

const environments = require("./config/environments");
const routes = require("./routes");
const errorHandler = require("./middlewares/error-handler.middleware");
const bodyParser = require('body-parser');
const app = express();

var path = require('path');
var fs = require('fs');
const morgan = require('morgan');

const PORT = environments.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use("/api", routes);

app.use(errorHandler);

app.use(bodyParser.json());

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
 
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

require("./config/database");

app.listen(PORT, () => console.log(`Server started on the port ${PORT}`));
