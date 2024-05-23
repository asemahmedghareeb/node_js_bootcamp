import express from 'express';
import { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } from '../controllers/courses.controllers.js';
import { validateCourse } from '../middlewares/validationSchema.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import userRoles  from '../utils/roles.js';
import allowedTo from '../middlewares/allowedTo.js';
const router = express.Router();

router.route('/')
    .get(getAllCourses)
    .post(verifyToken,validateCourse, createCourse);

router.route('/:id')
    .get(getCourseById)
    .patch(updateCourse)
    .delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),deleteCourse);

export default router;