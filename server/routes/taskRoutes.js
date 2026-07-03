const express=require('express');
const router=express.Router();

const {createTask,getTasks,updateTask,deleteTask,toggleComplete}=require('../controllers/taskController');
const protect=require('../middleware/authMiddleware');

router.post('/',protect,createTask);
router.get('/',protect,getTasks);
router.put('/:id',protect,updateTask);
router.delete('/:id',protect,deleteTask);
router.patch('/:id/toggle',protect,toggleComplete);

module.exports=router;

