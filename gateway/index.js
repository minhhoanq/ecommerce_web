const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const port = process.env.PORT || 6000;
const app = express();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use("/", require("./src/api/index"));

app.listen(port, () => {
    console.log(`Gateway runing on port: ${port}`);
});

module.exports = app;
