const  { Router } = require('express');
const { addNewMotorcycle } = require('./controllers/motorcycle.controller');
const { getServices } = require('./controllers/service.controller');
const { addNewUser, loginUser, logoutUser } = require('./controllers/user.controller');
const { authenticate } = require('./middlewares/authenticate.middleware');

const router = Router();

// router.get('/api/v1/home', authenticate, getServices);

router.post('/api/v1/users/add', addNewUser);
router.post('/api/v1/login', loginUser);
router.post('api/v1/motorcycles/add', authenticate, addNewMotorcycle);

router.delete('/api/v1/logout', authenticate, logoutUser);

module.exports = router;