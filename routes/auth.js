const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const cookieParser = require('cookie-parser')

router.use(cookieParser())

const { login,logout} = require('../controllers/auth');


const loginValidators = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 1 }).withMessage('Password is required').escape()
];


router.route('/login').post(loginValidators, (req, res, next) => {
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next({ message: errors.array() });
    }
    next();
}, login);


router.route('/logout').post(logout);


module.exports = router;
