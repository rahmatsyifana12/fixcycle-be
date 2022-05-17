const  { Router } = require('express');
const { addNewUser, loginUser } = require('./controllers/user.controller');
const { authenticate } = require('./middlewares/authenticate.middleware');

const router = Router();

router.post('/api/v1/users/add', addNewUser);
router.post('/api/v1/login', loginUser);

router.delete('/api/v1/logout', authenticate, logout);

module.exports = router;