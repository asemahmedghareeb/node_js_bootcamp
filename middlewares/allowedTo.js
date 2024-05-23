import { ERROR } from "../utils/httpSatusText.js";
import appError from "../utils/appError.js";    
const allowedTo = (...roles) => {
    return (req, res, next) => {
        // console.log(req.user)
        if (!roles.includes(req.user.role)) {
            const error = appError.createError("unauthorized", 401, ERROR);
            return next(error);
        }
        next();
    }
}
export default allowedTo;