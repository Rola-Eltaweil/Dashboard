import asyncHandler from 'express-async-handler'
import UserModel from '../models/User.js'

export const Deleteuser=asyncHandler(async(req,res,next)=>{
 const {id}=req.params
 const deleteduser=await UserModel.findByIdAndDelete(id)
 if(!id){
    return res.status(400).json({message:'user not exists'})
 }
 if(deleteduser){
    return res.status(200).json({message:'deletd succes'})
 } else{
    return res.status(404).json({message:'sth deleted wrong'})
 } 
 
})
export const Allusers = asyncHandler(async (req, res, next) => {
  try{
      const users=await UserModel.find().select('-password')
    if(users){
        return res.status(200).json({message:users})
    }else{
        return res.status(400).json({message:'No users found'})
    }
  }catch(err){
    console.log(err)
  }
});
