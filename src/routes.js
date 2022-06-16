const { Router } = require('express');
const { addNewMotorcycle, getAllMotorcyclesForUser, getMotorcycleById, editMotorcycle, deleteMotorcycle, getAllMotorcycles } = require('./controllers/motorcycle.controller');
const { getAllServices, addNewService, getAllServicesForUser, changeServiceStatus, getServiceById, getPaymentDetails, addPayment } = require('./controllers/service.controller');
const { addNewUser, loginUser, logoutUser, editUserProfile, getUser } = require('./controllers/user.controller');
const { authenticate } = require('./middlewares/authenticate.middleware');
const { validate } = require('./middlewares/validate.middleware');
const { newMotorcycleSchema, editMotorcycleSchema } = require('./validations/motorcycle.validation');
const { newUserSchema, editProfileSchema } = require('./validations/user.validation');

const router = Router();

router.get('/api/v1/users', authenticate, getUser);
router.get('/api/v1/services', authenticate, getAllServices);
router.get('/api/v1/services/user', authenticate, getAllServicesForUser);
router.get('/api/v1/motorcycles/user', authenticate, getAllMotorcyclesForUser);
router.get('/api/v1/motorcycles/:motorcycleId', authenticate, getMotorcycleById);
router.get('/api/v1/services/:serviceId', authenticate, getServiceById);
router.get('/api/v1/motorcycles', authenticate, getAllMotorcycles);

router.post('/api/v1/register', validate(newUserSchema), addNewUser);
router.post('/api/v1/login', loginUser);
router.post('/api/v1/motorcycles',
    authenticate,
    validate(newMotorcycleSchema),
    addNewMotorcycle);
router.post('/api/v1/services', authenticate, addNewService);
router.post('/api/v1/payments/:serviceId', authenticate, addPayment);
// router.post('/api/v1/payments', authenticate, addPayment);

router.put('/api/v1/users', authenticate, validate(editProfileSchema), editUserProfile);
router.put('/api/v1/motorcycles/:motorcycleId',
    authenticate,
    validate(editMotorcycleSchema),
    editMotorcycle);
router.put('/api/v1/services/:serviceId', authenticate, changeServiceStatus);

router.delete('/api/v1/logout', authenticate, logoutUser);
router.delete('/api/v1/motorcycles/:motorcycleId', authenticate, deleteMotorcycle);

module.exports = router;