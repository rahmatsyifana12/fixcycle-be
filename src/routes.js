const  { Router } = require('express');
const { addNewMotorcycle, getAllMotorcyclesForUser, getMotorcycleById, editMotorcycle } = require('./controllers/motorcycle.controller');
const { getAllServices, addNewService, getAllServicesForUser } = require('./controllers/service.controller');
const { addNewUser, loginUser, logoutUser, editUserProfile } = require('./controllers/user.controller');
const { authenticate } = require('./middlewares/authenticate.middleware');
const { validate } = require('./middlewares/validate.middleware');
const { newMotorcycleSchema, editMotorcycleSchema } = require('./validations/motorcycle.validation');
const { newUserSchema, editProfileSchema } = require('./validations/user.validation');

const router = Router();

router.get('/api/v1/services', authenticate, getAllServices);
router.get('/api/v1/services/user', authenticate, getAllServicesForUser);
router.get('/api/v1/motorcycles/user', authenticate, getAllMotorcyclesForUser);
router.get('/api/v1/motorcycles/:motorcycleId', authenticate, getMotorcycleById);

router.post('/api/v1/register', validate(newUserSchema), addNewUser);
router.post('/api/v1/login', loginUser);
router.post('/api/v1/motorcycles/add',
    authenticate,
    validate(newMotorcycleSchema),
    addNewMotorcycle);
router.post('/api/v1/services/:motorcycleId', authenticate, addNewService);

router.put('/api/v1/users/edit', authenticate, validate(editProfileSchema), editUserProfile);
router.put('/api/v1/motorcycles/edit/:motorcycleId',
    authenticate,
    validate(editMotorcycleSchema),
    editMotorcycle);

router.delete('/api/v1/logout', authenticate, logoutUser);

module.exports = router;