import { Router } from "express";
import {
	guard,
	authorize,
} from '../controller/authentication.controller';
import {
	createClass,
	getAllClasses,
	updateClass,
	deleteClass
} from '../controller/class.controller';
const router = Router();

router.use(guard);
router
	.route('/')
	.get(getAllClasses)
	.post(authorize(['tutor']), createClass);

router
	.route('/:id')
	.patch(authorize(['tutor']), updateClass)
	.delete(authorize(['tutor']), deleteClass);

export default router;