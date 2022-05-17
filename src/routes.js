const  { Router } = require('express');
const { addNewUser, loginUser } = require('./controllers/user.controller');

const router = Router();

router.post('/api/v1/users/add', addNewUser);
router.post('/api/v1/login', loginUser);

module.exports = router;