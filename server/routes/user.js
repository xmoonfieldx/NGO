const router = require("express").Router();
const NGO = require("../models/NGO");

router.get("/:email", (req, res) => {
    NGO.findOne({ email: req.params.email })
        .then((ngo) =>
            res.send({
                _id: ngo._id,
                name: ngo.name,
                email: ngo.email,
            })
        )
        .catch((err) => res.status(400).send(err));
});

module.exports = router;
