const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.headers["authorization"];
    if (typeof token !== "undefined") {
        const bearer = token.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
    } else {
        res.sendStatus(403);
    }

    try {
        const verified = jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send("Invalid Token");
    }
};
