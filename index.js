require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const models = require('./models/models');
const sequelize = require('./db');
const router = require('./routes/index');
const errorHandler  = require('./middleware/ErrorHandlingMiddleware');
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.use(express.static(path.resolve(__dirname, "static")));
app.use('/api', router);
app.use(fileUpload({}))

app.use(errorHandler);

async function start() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({});
        app.listen(PORT, () => console.log(`server started on port ${PORT}`));
    } catch (e) {
        console.log(e)
    }
}
start()
