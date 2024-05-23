import { SUCCESS, FAILED, ERROR } from '../utils/httpSatusText.js';
import { asyncWrapper } from '../middlewares/asyncWrapper.js';
import appError from '../utils/appError.js';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { generateJWT } from '../utils/generateJWT.js';

export const getAllUsers = asyncWrapper(
    async (req, res) => {
        let limit = req.query.limit || 5;
        let page = req.query.page || 1;
        if (page < 0 || limit < 0) {
            page = 1;
            limit = 3;
        }
        const skip = (page - 1) * limit;
        const users = await User.find({}, { __v: false, 'password': false }).limit(limit).skip(skip).exec();
        res.json({
            status: SUCCESS,
            data: { users }
        });
    }
)

export const register = asyncWrapper(
    async (req, res, next) => {
        const { firstName, lastName, email, password, role } = req.body;
        const oldUser = await User.findOne({ email: email });
        if (oldUser) {
            const error = appError.createError("user already exists", 400, FAILED);
            return next(error);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, email, password: hashedPassword, role,avatar:req.file.filename });
        await newUser.save();

        const token = await generateJWT({ email: newUser.email, id: newUser._id ,role:newUser.role});

        res.status(201).json({ status: SUCCESS, data: { user: newUser, token } });
    }
)
 
export const login = asyncWrapper(
    async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
            const error = appError.createError("email and password are required", 400, FAILED);
            return next(error);
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = appError.createError("user not found", 400, FAILED);
            return next(error);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = appError.createError("wrong password", 400, FAILED);
            return next(error);
        }
        const token = await generateJWT({ email: user.email, id: user._id,role:user.role });
        res.status(200).json({ status: SUCCESS, data: { token } });
    }
)