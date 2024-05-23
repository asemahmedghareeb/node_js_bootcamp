import express from 'express';
import { getAllUsers, register, login } from '../controllers/users.controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import multer from 'multer';
import appError from '../utils/appError.js';


const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const extension = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${extension}`;
        cb(null, fileName);
    }
});


const upload = multer({
    storage: diskStorage,
    fileFilter: (req, file, cb) => {
        const imageType = file.mimetype.split('/')[0];
        if (imageType === 'image') {
            return cb(null, true);
        }
        else {
            return cb(appError.createError('Only images are allowed', 400), false);
        }
    }
});

const router = express.Router();

router.route('/')
    .get(verifyToken, getAllUsers)

router.route('/register')
    .post(upload.single('avatar'), register);

router.route('/login')
    .post(login);
export default router; 