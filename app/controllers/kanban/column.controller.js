const Column = require('../../models/kanban/column.model');
const Task = require('../../models/kanban/task.model');

exports.create = async (req, res) => {
    const { title } = req.body;
    try {
        const columnsCount = await Column.countDocuments();
        const column = await Column.create({
            title,
            position: columnsCount > 0 ? columnsCount : 0
        });
        res.status(201).json(column);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getAll = async (req, res) => {
    try {
        const columns = await Column.find().populate('tasks');
        res.status(200).json(columns);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getOne = async (req, res) => {
    const { columnId } = req.params;
    try {
        const column = await Column.findById(columnId).populate('tasks');
        if (!column) {
            return res.status(404).json({ message: 'Column not found' });
        }
        res.status(200).json(column);
    } catch (err) {
        res.status(500).json(err);
    }
};


exports.update = async (req, res) => {
    const { columnId } = req.params;
    const { title } = req.body;
    try {
        const column = await Column.findByIdAndUpdate(columnId, { title }, { new: true });
        if (!column) {
            return res.status(404).json({ message: 'Column not found' });
        }
        res.status(200).json(column);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.delete = async (req, res) => {
    const { columnId } = req.params;
    try {
        const column = await Column.findById(columnId);
        if (!column) {
            return res.status(404).json({ message: 'Column not found' });
        }
        await Task.deleteMany({ columnId });
        await Column.deleteOne({ _id: columnId });
        res.status(200).json({ message: 'Column deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
};
