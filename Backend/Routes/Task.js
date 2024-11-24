import express from 'express'
import { create_Task, Delete_Task, Get_All_Task, getTask, UpdateTask } from '../controller/Tasks.js';
import userauth from '../middleware/userauth.js';
const router=express.Router()


router.post("/Task/create_Task",userauth,create_Task);
router.get('/Task/GetTasks',userauth,Get_All_Task)
router.get('/Task/getTask/:id',userauth,getTask)
router.put('/Task/UpdateTask/:id',userauth,UpdateTask)
router.delete('/Task/DeleteTask/:id',userauth,Delete_Task)
export default router


