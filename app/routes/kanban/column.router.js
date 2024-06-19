const express = require('express');
const router = express.Router();
const { param } = require('express-validator')

const validation = require('../../handlers/validation')
const columnController = require('../../controllers/kanban/column.controller');

router.get('/', columnController.getAll);

router.get('/:columnId',
    param('columnId').custom(value => {
        if (!validation.isObjectId(value)) {
            return Promise.reject('invalid id')
        } else return Promise.resolve()
    }),
    validation.validate,
    columnController.getOne);

router.post('/', columnController.create);

router.put('/:columnId',
    param('columnId').custom(value => {
        if (!validation.isObjectId(value)) {
            return Promise.reject('invalid id')
        } else return Promise.resolve()
    }),
    validation.validate,
    columnController.update);
    
router.delete('/:columnId',
    param('columnId').custom(value => {
        if (!validation.isObjectId(value)) {
            return Promise.reject('invalid id')
        } else return Promise.resolve()
    }),
    validation.validate,
    columnController.delete);

module.exports = router;
