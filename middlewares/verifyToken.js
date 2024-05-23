import appError from "../utils/appError.js";
import { ERROR } from "../utils/httpSatusText.js";
import { asyncWrapper } from "./asyncWrapper.js";
import jwt from 'jsonwebtoken';
export const verifyToken =asyncWrapper(
async(req, res, next) => {
        const authHeader = req.headers['authorization'] || req.headers["Authorization"];
        const token = authHeader?.split(' ')[1] || '';
        if(!token){
            const error=appError.createError("No token provided", 401,ERROR);
            return next(error);
        }
        const decoded =jwt.verify(token, process.env.JWT_SECRET);
        req.user=decoded;
        next();    
    }  
)