const express = require('express');
const router = express.Router();
const { param, body } = require('express-validator')
const validation = require('../../handlers/validation')

const taskController = require('../../controllers/kanban/task.controller');

router.post('/',
    body('columnId').custom(value => {
        if (!validation.isObjectId(value)) {
            return Promise.reject('invalid column id')
        } else return Promise.resolve()
    }),
    validation.validate,
    taskController.create);

router.put('/:taskId',
    param('taskId').custom(value => {
        if (!validation.isObjectId(value)) {
            return Promise.reject('invalid task id')
        } else return Promise.resolve()
    }),
    validation.validate,
    taskController.update);

router.delete('/:taskId',
    param('taskId').custom(value => {
        if (!validation.isObjectId(value)) {
            return Promise.reject('invalid task id')
        } else return Promise.resolve()
    }),
    validation.validate,
    taskController.delete);

router.put('/update-position/:taskId',
    param('taskId').custom(value => {
        if (!validation.isObjectId(value)) {
            return Promise.reject('invalid task id')
        } else return Promise.resolve()
    }),
    validation.validate,
    taskController.updatePosition);

module.exports = router;
