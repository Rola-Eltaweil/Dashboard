import asyncHandler from 'express-async-handler'
import TaskModel from '../models/Task.js';
import UserModel from '../models/User.js';
import mongoose from 'mongoose';

export const create_Task = asyncHandler(async (req, res, next) => {
  try{
    const { title, description, proireties, dueDate, status } = req.body;

    if(!title||title.trim()===""){
        return res.status(404).json({message:'Title is required'})
    }
    if(!description ||description.trim()===""){
        return res.status(404).json({message:"Description is required"})
    }
    const Task= new TaskModel({
        title,
        description,
        proireties,
        dueDate,
        status,
        user:req.user_Id
    })
    const savedTask=await Task.save()
    if(savedTask){
        return res.status(200).json({message:'Create Taske success' ,data:savedTask})
    }else{
        return res.status(404).json({message:'sth wrong'})
    }
   
  }catch(err){
   return res.status(400).json({error:err})
  }
});


export const Get_All_Task = asyncHandler(async (req, res, next) => {
  try {
    const userId=req.user_Id
    const Getall = await TaskModel.find({user:userId});
    if(Getall){
   return res.status(200).json({data:Getall,LengthTask:Getall.length})
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

export const getTask = asyncHandler(async (req, res, next) => {
  try {
    const userId=req.user_Id
    const {id}=req.params
    if(!id){
        return res.status(404).json({message:'No Task here'})
    }
   const findTask=await TaskModel.findById(id)
   if(findTask){
    return res.status(200).json({message:findTask})
   }
   if(findTask.user!==userId){
    return res.status(404).json({message:'Not authorized'})
   }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

export const UpdateTask=asyncHandler(async(req,res,next)=>{
    try{
    const { title, description, Status, isComplete, proireties, dueDate } =
      req.body;
    const {id}=req.params
    const Tasks=await TaskModel.find({user:req.user_Id})
    if(!Tasks){
        return res.status(400).json({message:'No Task here'})
    }else{
        const findtask=await TaskModel.findById(id)
        if(!findtask){
          return res.status(400).json({message:'Task not found'})
        }
        findtask.title=title || findtask.title
        findtask.description=description ||findtask.description
        findtask.Status = Status || findtask.Status;
        findtask.isComplete=isComplete || findtask.isComplete
        findtask.proireties=proireties ||findtask.proireties
        findtask.dueDate=dueDate ||findtask.dueDate
       await findtask.save() 
       return res.status(200).json({message:findtask,message:'updated succes'})
    }
    }catch(err){
        console.log(err)
        return res.status(400).json({message:err})
    }
})

export const Delete_Task = asyncHandler(async (req, res, next) => {
  try {
    const { id }=req.params
    if(!id){
        return res.status(404).json({message:'The task not found'})
    }
    const Task = await TaskModel.find({ user: req.user_Id });
    if(!Task){
        return res.status(404).json({message:'The task not found'})
    }
    const deleteOne = await TaskModel.deleteOne({_id :id});
    console.log(deleteOne)
    if(deleteOne){
        return res.status(200).json({message:'deleted succes'}) 
    }else{
        return res.status(404).json({message:'error'})
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});





