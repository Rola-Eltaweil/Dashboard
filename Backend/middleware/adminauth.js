import UserModel from "../models/User.js"
import asyunchandler from 'express-async-handler'

export const adminauth=async(req,res,next)=>{
  try{
      const {user_Id}=req.body
      const finduser=await UserModel.findOne(user_Id)
       if (finduser&&finduser.role.includes("admin")) {
         next();
         return;
       } else {
         return res
           .status(403)
           .json({ meesage: "The Admin only can do this !" });
       }

  }catch(err){
    console.log(err)
    return res.status(400).json({message:err})
  }
}

export const creatorauth=async(req,res,next)=>{
  try{
  
  const finduser=await UserModel.findOne({_id:req.user_Id})
  if (
    finduser &&
    finduser.role.includes("admin") &&
    finduser.role.includes("creator")
  ) {
    next();
    return;
  } else {
    return res.status(403).json({ meesage: "The Admin only can do this !" });
  }
  }catch(err){
    console.log(err)
    return res.status(400).json({ message: err });
   
  }
}

export const verifiedauth=asyunchandler(async(req,res,next)=>{
 try {
   const finduser = await UserModel.findOne({_id:req.user_Id});
   if (finduser && finduser.isVerifed) {
     next();
     return;
   } else {
     return res.status(400).json({ meesage: "Please verify your email address !" });
   }
 } catch (err) {
   console.log(err);
   return res.status(400).json({ message: err });
 }
})

