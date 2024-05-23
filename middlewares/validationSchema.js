import {body} from 'express-validator'

export const validateCourse=[
    body('title')
        .notEmpty()
        .withMessage({ msg: 'title is Required' })
        .isLength({ min: 2 })
        .withMessage({ msg: 'title as least is 2 digits' }),
    body('price')
        .notEmpty()
        .withMessage({ msg: 'price is Required' })
]