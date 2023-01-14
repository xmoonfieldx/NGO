const router = require("express").Router();
const NGO = require("../models/NGO");
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../mail");

//validation
const registerSchema = joi.object({
    name: joi.string().required(),
    description: joi.string().required(),
    availability: joi.string().required(),
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
});

const loginSchema = joi.object({
    email: joi.string().min(10).required(),
    password: joi.string().min(6).required(),
});

router.post("/register", async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const emailExist = await NGO.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const ngo = new NGO({
        name: req.body.name,
        description: req.body.description,
        availability: req.body.availability,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        await ngo.save((err, ngo) => {
            if (ngo) {
                res.send({ ngo: ngo._id });
            } else {
                res.send(err.errors.email.message);
            }
        });
    } catch {
        res.status(400).send(err);
    }
});

router.post("/login", async (req, res) => {
    const validation = loginSchema.validate(req.body);
    if (validation.error)
        res.status(400).send(validation.error.details[0].message);
    const ngo = await NGO.findOne({ email: req.body.email });
    if (!ngo) res.status(400).send("Email or Password is wrong");
    bcrypt.compare(req.body.password, ngo.password, (err, result) => {
        if (result) {
            const accessToken = jwt.sign(
                { _id: ngo._id },
                process.env.ACCESS_TOKEN_SECRET
            );
            NGO.findOne({ email: req.body.email }).then((ngo) => {
                res.json({
                    _id: ngo._id,
                    name: ngo.name,
                    description: ngo.description,
                    availability: ngo.availability,
                    email: ngo.email,
                    accessToken: accessToken,
                });
            });
        } else {
            res.status(400).send("Email or password is wrong");
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
    const ngo = await NGO.findOne({ email: email });
    if (!ngo) res.status(400).send("Email or password is wrong");

    const secret = process.env.RESET_PASSWORD_SECRET + ngo.password;
    const payload = {
        email: ngo.email,
        id: ngo._id,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "15m" });
    const link = `http://localhost:3000/${ngo._id}/${token}`;
    sendEmail(email, link);
    res.status(200).send("Password reset link has been sent to your email");
});

router.post("/reset-password", async (req, res) => {
    const { id, token } = req.body;
    const ngo = await NGO.findOne({ _id: id });
    if (!ngo) res.status(401).send("Invalid NGO");
    const secret = process.env.RESET_PASSWORD_SECRET + ngo.password;
    try {
        const payload = jwt.verify(token, secret);
        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        ngo.password = hashPassword;
        await ngo.save();
        res.status(200).send("Password Reset Done");
    } catch (err) {
        res.status(401).send("Invalid token");
    }
});

module.exports = router;
