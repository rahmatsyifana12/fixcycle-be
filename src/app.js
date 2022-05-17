const express = require('express');
const config = require('./configs/config');

const app = express();
const port = config.port;

app.use(express.json());

app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`);
});