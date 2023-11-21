const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')

app.use(express.json());
var cors = require("cors");

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));
const port = 7000;
const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(cookieParser())

app.use(express.urlencoded({ extended: true }))


const { Retailer } = require("./Routes/tbl_retailer_register")
app.use("/", Retailer);


app.listen(port, () => {
    console.log(`server is running on ${port}`)
});
