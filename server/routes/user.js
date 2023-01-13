const router = require("express").Router();
const Student = require("../models/Student");

router.get("/:email", (req, res) => {
    Student.findOne({ email: req.params.email })
        .then((student) =>
            res.send({
                _id: student._id,
                name: student.name,
                email: student.email,
            })
        )
        .catch((err) => res.status(400).send(err));
});

module.exports = router;
