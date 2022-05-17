const  { Router } = require('express');
const { addNewUser } = require('./controllers/user.controller');

const router = Router();

router.post('/api/v1/users/add', addNewUser);

module.exports = router;