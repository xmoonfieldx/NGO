const router = require("express").Router();
const Student = require("../models/Student");
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

        const student = new Student({
            name: req.body.name,
            usn: req.body.usn,
            admn_num: req.body.admn_num,
            email: req.body.email,
            password: hashPassword,
        });
        try {
            await student.save((err, student) => {
                if (student) {
                    res.send({ student: student._id });
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
    const student = await Student.findOne({ usn: req.body.usn });
    if (!student) res.status(400).send("USN or password is wrong");

    //check if password is correct
    bcrypt.compare(req.body.password, student.password, (err, result) => {
        if (result) {
            //create and assign a token
            const accessToken = jwt.sign(
                { _id: student._id },
                process.env.ACCESS_TOKEN_SECRET
            );

            Student.findOne({ usn: req.body.usn }).then((student) => {
                res.json({
                    _id: student._id,
                    name: student.name,
                    usn: student.usn,
                    admn_num: student.admn_num,
                    email: student.email,
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
    const student = await Student.findOne({ email: email });
    if (!student) res.status(400).send("Email or password is wrong");

    //if student exists
    const secret = process.env.RESET_PASSWORD_SECRET + student.password;
    const payload = {
        email: student.email,
        id: student._id,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "15m" });
    const link = `http://localhost:3000/${student._id}/${token}`;
    sendEmail(email, link);
    res.status(200).send("Password reset link has been sent to your email");
});

router.post("/reset-password", async (req, res) => {
    const { id, token } = req.body;
    const student = await Student.findOne({ _id: id });
    if (!student) res.status(401).send("Invalid student id");
    const secret = process.env.RESET_PASSWORD_SECRET + student.password;
    try {
        const payload = jwt.verify(token, secret);
        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        student.password = hashPassword;
        await student.save();
        res.status(200).send("Password Reset Done");
    } catch (err) {
        res.status(401).send("Invalid token");
    }
});

module.exports = router;
