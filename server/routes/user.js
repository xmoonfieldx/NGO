const router = require("express").Router();
const User = require("../models/User");

router.get("/:email", (req, res) => {
    User.findOne({ email: req.params.email })
        .then((user) =>
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
            })
        )
        .catch((err) => res.status(400).send(err));
});

module.exports = router;
