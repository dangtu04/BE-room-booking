require("dotenv").config();
const express = require("express");
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');
const bodyParser = require("body-parser");
const connectDB = require("./config/connectDB");
const initWebRoutes = require("./routes/web");
const cors = require('cors')



const app = express();
app.use(cors({credentials: true, origin: true}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


const port = process.env.PORT || 8081;

// config template engine
configViewEngine(app)

// khai báo route


initWebRoutes(app);
connectDB();



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
