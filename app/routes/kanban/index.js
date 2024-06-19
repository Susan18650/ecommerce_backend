var router = require('express').Router()

router.use('/column', require("./column.router"))
router.use('/task', require("./task.router"))

module.exports = router;