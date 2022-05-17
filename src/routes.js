const  { Router } = require('express');
const { addNewUser } = require('./controllers/user.controller');

const router = Router();

router.post('/api/v1/register', addNewUser);

module.exports = router;