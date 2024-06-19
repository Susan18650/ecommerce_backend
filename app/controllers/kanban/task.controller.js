const Task = require('../../models/kanban/task.model');
const Column = require('../../models/kanban/column.model');

exports.create = async (req, res) => {
    const { columnId, content } = req.body;
    try {
      const column = await Column.findById(columnId);
      if (!column) {
        return res.status(404).json({ message: 'Column not found' });
      }
      const tasksCount = await Task.countDocuments({ columnId });
      const task = await Task.create({
        columnId,
        content,
        position: tasksCount
      });
      // Add the new task to the column's tasks array
      column.tasks.push(task);
      await column.save();
      res.status(201).json(task);
    } catch (err) {
      res.status(500).json(err);
    }
  };
  

exports.update = async (req, res) => {
  const { taskId } = req.params;
  const { content } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(taskId, { content }, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.delete = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await Task.deleteOne({ _id: taskId });
    const tasks = await Task.find({ columnId: task.columnId }).sort('position');
    for (let i = 0; i < tasks.length; i++) {
      tasks[i].position = i;
      await tasks[i].save();
    }
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updatePosition = async (req, res) => {
    const { taskId, newPosition, columnId } = req.body;
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      const tasksInSameColumn = await Task.find({ columnId }).sort('position');
      // Create a new array for updated positions
      let updatedPositions = [];
      // Insert the moved task at its new position
      updatedPositions[newPosition] = task;
      // Iterate over all tasks
      for (let i = 0, j = 0; i < tasksInSameColumn.length; i++) {
        // Skip over the moved task
        if (tasksInSameColumn[i].id === taskId) continue;
        // Skip over the new position of the moved task
        while (updatedPositions[j]) j++;
        // Assign new position to the current task
        updatedPositions[j] = tasksInSameColumn[i];
      }
      // Save all tasks with their new positions
      for (let i = 0; i < updatedPositions.length; i++) {
        updatedPositions[i].position = i;
        await updatedPositions[i].save();
      }
      res.status(200).json({ message: 'Task position updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
      }
  };
  
