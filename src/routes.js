const  { Router } = require('express');
const { addNewMotorcycle, getAllMotorcyclesForUser } = require('./controllers/motorcycle.controller');
const { getAllServices, addNewService, getAllServicesForUser } = require('./controllers/service.controller');
const { addNewUser, loginUser, logoutUser } = require('./controllers/user.controller');
const { authenticate } = require('./middlewares/authenticate.middleware');
const { validateHandler } = require('./middlewares/validate.middleware');
const { newUserSchema } = require('./validations/user.validation');

const router = Router();

router.get('/api/v1/services', authenticate, getAllServices);
router.get('/api/v1/services/user', authenticate, getAllServicesForUser);
router.get('/api/v1/motorcycles/user', authenticate, getAllMotorcyclesForUser);

router.post('/api/v1/users/add', validateHandler(newUserSchema), addNewUser);
router.post('/api/v1/login', loginUser);
router.post('/api/v1/motorcycles/add', authenticate, addNewMotorcycle);
router.post('/api/v1/services/:motorcycleId', authenticate, addNewService);

router.delete('/api/v1/logout', authenticate, logoutUser);

module.exports = router;