import { validationResult } from 'express-validator';
import Course from '../models/course.model.js';
import { SUCCESS, FAILED, ERROR } from '../utils/httpSatusText.js';
import { asyncWrapper } from '../middlewares/asyncWrapper.js';
import appError from '../utils/appError.js';

const getAllCourses = asyncWrapper(
    async (req, res) => {
        let limit = req.query.limit || 5;
        let page = req.query.page || 1;
        if (page < 0 || limit < 0) {
            page = 1;
            limit = 3;
        }
        const skip = (page - 1) * limit;
        const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip).exec();
        res.json({
            status: SUCCESS,
            data: { courses }
        });

    } 
)

const getCourseById = asyncWrapper(
    async (req, res, next) => {
        const courseId = req.params.id;
        const course = await Course.findById(courseId);
        if (!course) {
            const error = appError.createError("course not found", 404, FAILED);
            return next(error);
        }
        res.json({
            status: SUCCESS,
            data: { course }
        });
    }
)


const createCourse = asyncWrapper(
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = appError.createError(errors.array()[0].msg, 400, FAILED);
            return next(error);
        }
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json({ status: SUCCESS, data: { course: newCourse } });
    }
)

const updateCourse = asyncWrapper(
    async (req, res,next) => {
        const courseId = req.params.id;
        const updatedCourse = await Course.findByIdAndUpdate(courseId, { $set: { ...req.body } }, { new: true });
        if (!updatedCourse) {
            const error = appError.createError("course not found", 404, FAILED);
            return next(error);
        }
        res.status(200).json({ status: SUCCESS, data: { course: updatedCourse } });
    }
);

const deleteCourse = asyncWrapper(
    async (req, res, next) => {
        let courseId = req.params.id;
        let deletedCourse = await Course.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            const error = appError.createError("course not found", 404, FAILED);
            return next(error);
        }
        res.status(200).json({ status: SUCCESS, data: null });
    }
);
export { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse }; 