import {
    signup,
	login,
	guard,
    authorize,
} from '../controller/authentication.controller';

import { subscribe, unSubscribe } from '../controller/user.controller';
import { Router } from 'express';

const router = Router();

router.post('/auth/login', login);
router.post('/auth/signup', signup);

router.use(guard);
router.use(authorize(['student']));
router
    .route('/subscribe/:id')
    .post(subscribe)
    .delete(unSubscribe);
export default router;