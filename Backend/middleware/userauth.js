
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
const userauth=asyncHandler(async(req,res,next)=>{
 try{
   const {token}=req.cookies
 console.log(token)
 if(!token){
    return res.status(401).json({message:'you are not authorized ,please login again '})
 }else{
    const decode = jwt.verify(token, process.env.JWT_SECRETKAY);
    req.user_Id=decode._id
    next()
 }
 }catch(err){
   console.log(err)
   return res.status(400).json({message:err})
 }
})
export default userauth