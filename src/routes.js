const  { Router } = require('express');
const { addNewMotorcycle, getAllMotorcyclesFromUser } = require('./controllers/motorcycle.controller');
const { getAllServices } = require('./controllers/service.controller');
const { addNewUser, loginUser, logoutUser } = require('./controllers/user.controller');
const { authenticate } = require('./middlewares/authenticate.middleware');

const router = Router();

// router.get('/api/v1/services', authenticate, getAllServices);
router.get('/api/v1/motorcycles', authenticate, getAllMotorcyclesFromUser);

router.post('/api/v1/users/add', addNewUser);
router.post('/api/v1/login', loginUser);
router.post('/api/v1/motorcycles/add', authenticate, addNewMotorcycle);
// router.post('api/v1/services/add/:motorcycleId',);

router.delete('/api/v1/logout', authenticate, logoutUser);

module.exports = router;