const express = require('express');

const app = express();
const port = 5000;

app.use(express.json());

app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`);
});