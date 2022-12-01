const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { body, query, validationResult } = require("express-validator");

// login
exports.login = function(req, res) {
    passport.authenticate("local", { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({
                message: "Incorrect Email or Password",
                user,
            });
        }

        jwt.sign({ _id: user._id, email: user.email },
            "amakipkip", { expiresIn: "24h" },
            (err, token) => {
                if (err) return res.status(400).json(err);
                res.json({
                    message: "Login Successful!",
                    token: token,
                    user
                });
            }
        );
    })(req, res);
};

// signup
exports.register = [
    // sanitize and validate fields
    body("email").normalizeEmail().isEmail(),
    body("password").trim().isLength({ min: 6 }).escape(),
    // process request
    async(req, res, next) => {
        // extract errors
        const errors = validationResult(req.body);

        if (!errors.isEmpty()) return res.json({ errros: errors.array() });

        // check if email exists
        const emailExists = await User.find({ email: req.body.email });
        if (emailExists.length > 0) {
            return res.status(409).json({
                error: "Email already exists",
            });
        }

        // create new user
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) return next(err);

            User.create({
                email: req.body.email,
                password: hash,
            }, (err, user) => {
                if (err) return next(err);

                // return response
                return res.status(200).json({
                    message: "Signup successful!",
                    user
                });
            });
        });
    },
];