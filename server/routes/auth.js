const router = require("express").Router();
const User = require("../models/User");
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../mail");

//validation
const registerSchema = joi.object({
    name: joi.string().required(),
    usn: joi.string().min(10).required(),
    admn_num: joi.string().required(),
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
});

const loginSchema = joi.object({
    usn: joi.string().min(10).required(),
    password: joi.string().min(6).required(),
});

router.post("/register", async (req, res) => {
    //validate data before creating a user
    const validation = registerSchema.validate(req.body);
    if (validation.error)
        res.status(400).send(validation.error.details[0].message);
    else {
        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            name: req.body.name,
            usn: req.body.usn,
            admn_num: req.body.admn_num,
            email: req.body.email,
            password: hashPassword,
        });
        try {
            await user.save((err, user) => {
                if (user) {
                    res.send({ user: user._id });
                } else {
                    res.send(err.errors.email.message);
                }
            });
        } catch {
            res.status(400).send(err);
        }
    }
});

router.post("/login", async (req, res) => {
    const validation = loginSchema.validate(req.body);
    if (validation.error)
        res.status(400).send(validation.error.details[0].message);

    //check if email exists
    const user = await User.findOne({ usn: req.body.usn });
    if (!user) res.status(400).send("USN or password is wrong");

    //check if password is correct
    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result) {
            //create and assign a token
            const accessToken = jwt.sign(
                { _id: user._id },
                process.env.ACCESS_TOKEN_SECRET
            );

            User.findOne({ usn: req.body.usn }).then((user) => {
                res.json({
                    _id: user._id,
                    name: user.name,
                    usn: user.usn,
                    admn_num: user.admn_num,
                    email: user.email,
                    accessToken: accessToken,
                });
            });
        } else {
            res.status(400).send("USN or password is wrong");
        }
    });
});

router.post("/validate", async (req, res) => {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded) {
        return res.status(200).send();
    } else {
        return res.status(400).send();
    }
});

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    //check if email exists
    const user = await User.findOne({ email: email });
    if (!user) res.status(400).send("Email or password is wrong");

    //if user exists
    const secret = process.env.RESET_PASSWORD_SECRET + user.password;
    const payload = {
        email: user.email,
        id: user._id,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "15m" });
    const link = `http://localhost:3000/${user._id}/${token}`;
    sendEmail(email, link);
    res.status(200).send("Password reset link has been sent to your email");
});

router.post("/reset-password", async (req, res) => {
    const { id, token } = req.body;
    const user = await User.findOne({ _id: id });
    if (!user) res.status(401).send("Invalid user id");
    const secret = process.env.RESET_PASSWORD_SECRET + user.password;
    try {
        const payload = jwt.verify(token, secret);
        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        user.password = hashPassword;
        await user.save();
        res.status(200).send("Password Reset Done");
    } catch (err) {
        res.status(401).send("Invalid token");
    }
});

module.exports = router;
