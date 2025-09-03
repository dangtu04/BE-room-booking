require("dotenv").config();
const express = require("express");
const configViewEngine = require("./config/viewEngine");
// const webRoutes = require("./routes/web");
const bodyParser = require("body-parser");
const connectDB = require("./config/connectDB");
const cors = require("cors");
const initApiRoutes = require("./routes/api");

const app = express();
app.use(cors({ credentials: true, origin: true }));

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const port = process.env.PORT || 8081;

// config template engine
configViewEngine(app);

// khai báo route
initApiRoutes(app)
connectDB();

app.listen(port, () => {
  console.log(`Backend Nodejs App listening on port ${port}`);
});
