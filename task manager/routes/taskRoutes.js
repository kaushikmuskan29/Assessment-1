import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import{
    createTask, getAllTasks, getTaskById, updateTask, deleteTask
} from '../controllers/taskcontroller.js';

const router = express.Router();

router.post('/', verifyToken, createTask);
router.get('/', verifyToken, getAllTasks)
router.get('/:id', verifyToken, getTaskById)
router.put('/:id', verifyToken, updateTask)
router.delete('/:id', verifyToken, deleteTask)

export default router;