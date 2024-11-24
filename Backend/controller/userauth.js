import asyncHandler from "express-async-handler";
import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import tokenModel from "../models/Token.js";
import crypto from 'node:crypto'
import hashToken from "../helper/hasheToken.js";
import sendEmail from "../helper/sendEmail.js";

const Register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name ||!email ||!password) {
    return res.status(400).json({ message: "Missed Details ..." });
  }
  if (name.length < 3) {
    return res
      .status(400)
      .json({ message: "Name must be min 3 char ..." });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "password must be min 8 char ..." });
  }
  const user = await UserModel.findOne({ email: email });
  if (user) {
    return res
      .status(400)
      .json({ message: "The Email is Already been exists" });
  } else {
    const hashingpassword = await bcrypt.hash(password, 10);
    const { photo, bio, role, isVerifed } = req.body;
    const dataUser = {
      name,
      email,
      password: hashingpassword,
      photo,
      bio,
      role,
      isVerifed,
    };
    const createdUser = new UserModel(dataUser);
    const register = await createdUser.save();
    if (!register) {
      return res.status(400).json({ message: "sth wrong" });
    } else {
      const token = jwt.sign({ _id: register._id }, process.env.JWT_SECRETKAY, {
        expiresIn: "7day",
      });
      res.cookie("token", token, {
        path: "/",
        sameSite: "Strict",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return res.status(201).json({ message: register });
    }
  }
});

const Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missed Detailes" });
  }
  const Users = await UserModel.findOne({ email: email });
  if (!Users) {
    return res.status(400).json({ message: "Invalid Email or Password " });
  } else {
    const comparepassword = await bcrypt.compare(password, Users.password);
    if (comparepassword) {
      const token = jwt.sign({ _id: Users._id }, process.env.JWT_SECRETKAY, {
        expiresIn: "7day",
      });
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Strict",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      const { bio, role, isVerifed, name, photo  } = Users;
      return res.status(200).json({
        message: "Login Succsessfully",
        data: { bio, role, isVerifed, name, email, password, photo },
        token: token,
      });
    }else{
      return res.status(400).json({ message: "Email or password not valid" });
    }
    
  }
});

const loggedstatus=asyncHandler(async(req,res,next)=>{
  const {token}=req.cookies
  if(!token){
    return res.status(401).json({message:"you are unauthorized ,please login again"})
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRETKAY);
  if(decoded){
    return res.status(200).json({message:"User is logged in"})
  }
})

const userProfile = asyncHandler(async (req, res, next) => {
  const Getuser = await UserModel.findOne({ _id: req.user_Id }).select("-password");
  if (Getuser) {
    return res.status(200).json({ data: Getuser });
  } else {
    return res.status(401).json({ meesage: "not authorized" });
  }
});

const userUpdate = asyncHandler(async (req, res, next) => {
  const { name,email, photo } = req.body;
  const data = {
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
  };
  const Updateduser = await UserModel.findByIdAndUpdate(req.user_Id, data);
  if (Updateduser) {
    return res.status(200).json({ message: "Updated successfully" });
  } else {
    return res.status(400).json({ meesage: "sth wrong" });
  }
});

const logout=asyncHandler(async(req,res,next)=>{
 res.clearCookie('token')
 return res.status(200).json({message:'Logout success'})
})


const verfiyEmail=asyncHandler(async(req,res,next)=>{
 const user = await UserModel.findOne({ _id: req.user_Id });

 if(!user){
  return res.status(400).json({message:'user not found'})
 }
 if (user.isVerifed) {
   return res.status(400).json({ meesage: "user is already verified" });
 }

 const tokenuser = await tokenModel.findOne({ userId: req.user_Id });
 if (tokenuser) {
   await tokenuser.deleteOne();
 }
 //create verification token by userid
 const verifivationtoken=crypto.randomBytes(64).toString('hex')+ user._id
 const hashedToken=hashToken(verifivationtoken)
 const created=new tokenModel({
   userId: user._id,
   verificationToken: hashedToken,
   passwordResetToken:'',
   createdAt: Date.now(),
   expiresAt:Date.now()+24*60*60*1000, //24hours
 });
await created.save()
 
//created verification link
const verificationlink = `${process.env.FRONTEND_URL}/verify-Email/${verifivationtoken}`;
//send email
const subject="Email Verification -AuthKit"
const send_to=user.email
const replay_to="rola2002el@gmail.com"
const template = "emailverification";
const send_from = process.env.USER_EMAIL;
const name=user.name
const link=verificationlink

try{
 const sending_email = await sendEmail(
   subject,
   send_to,
   replay_to,
   template,
   send_from,
   name,
   link
 );
 if (
   sending_email &&
   sending_email.accepted &&
   sending_email.accepted.length > 0
 ) {
   return res.status(200).json({ message: "Email send succes" });
 } else {
   return res.status(404).json({ message: "Email fail" });
 }

}catch(err){
 console.log(err)
 return res.status(404).json({message:'Email Could not be sent ,'})
}
})

const verifying_user=asyncHandler(async(req,res,next)=>{
 try{
  const { verificationToken } = req.params;
 if (!verificationToken) {
   return res.status(400).json({ message: "The verification Token not valid" });
 }
 const hashedToken = hashToken(verificationToken);
 const userToken = await tokenModel.findOne({
   verificationToken: hashedToken,
 });
 console.log(userToken,'toekfds')
 if(!userToken){
  return res.status(404).json({message:'Invalid or expired verification Token',data:userToken})
 }
 const user =await UserModel.findById(userToken.userId)
 if(user.isVerifed){
  return res.status(404).json({message:'user is already verified'})
 }
 user.isVerifed=true
 await user.save()
 return res.status(200).json({message:'User verified success'})
 }catch(err){
  console.log(err,'Not make')
  return res.status(400).json({message:err})
 }
})

const forgettenPassword=asyncHandler(async(req,res,next)=>{
  const {email}=req.body
  if(!email){
    return res.status(400).json({message:'Email is required'})
  }
  const user=await UserModel.findOne({email:email})
  if(!user){
    return res.status(404).json({message:'user not found'})
  }

  const token=await tokenModel.findOne({userId:user._id})
  if(token){
    await token.deleteOne()
  }
  //create new token 
  const restpasswordToken=crypto.randomBytes(64).toString('hex')+user._id
  const hashedtoken=hashToken(restpasswordToken)
   const newone = new tokenModel({
     userId: user._id,
     passwordResetToken: hashedtoken,
     createdAt: Date.now(),
     expiresAt: Date.now() + 60 * 60 * 1000,
   });
  await newone.save()
 //rest link
 const PasswordResetlink = `${process.env.FRONTEND_URL}/Resetpassword/${restpasswordToken}`;
 //send email
 const subject = "ResetPassword verification -AuthKit";
 const send_to = user.email;
 const replay_to = "noreplay@noreplay.com";
 const template = "restpassword";
 const send_from = process.env.USER_EMAIL;
 const name = user.name;
 const link = PasswordResetlink;

 //sending email
try{
   const sending_email = await sendEmail(
     subject,
     send_to,
     replay_to,
     template,
     send_from,
     name,
     link
   );
   if (sending_email) {
    return res
      .status(200)
      .json({ message: "Password reset link sent successfully" });
   }

}catch(err){
  console.log(err)
  return res.status(404).json({message:'The email not send'})
}
})

const restPssword=asyncHandler(async(req,res,next)=>{
 const {resetPasswordToken}=req.params
 const {password}=req.body

 const hashedPassword=hashToken(resetPasswordToken)
 console.log(hashedPassword,'dfd')
 const userToken = await tokenModel.findOne({
   passwordResetToken:hashedPassword,
   expiresAt:{$gt:Date.now()},
 });
 if(!userToken){
  return res.status(404).json({message:'Invalid or token expire'})
 }
 const user=await UserModel.findById(userToken.userId)
 if(!user){
  return res.status(404).json({message:'user not found'})
 }
 const hashingpassword=await bcrypt.hash(password,10)
 user.password = hashingpassword;
 await user.save()
 return res.status(200).json({message:'Password reset Succesfully '})
}) 

const ChangePassword=asyncHandler(async(req,res,next)=>{
 const { newpassword, currentpassword } = req.body;
 if(newpassword.length<8){
  return res.status(400).json({message:'The newpassword should be more than 8char'})
 }
 if(!newpassword ||!currentpassword){
  return res.status(404).json({message:'All fields is required'})
 }
 const user = await UserModel.findOne({_id:req.user_Id});
 console.log('this user',user)
 if(!user){
  return res.status(400).json({ message: "The user not found" });
 }

 const isMatch = await bcrypt.compare(currentpassword, user.password);
 if(!isMatch){
  return res.status(404).json({ message: "password invalid" });
 }
 
 const hashingnewpassword=await bcrypt.hash(newpassword,10)
 user.password=hashingnewpassword
 await user.save()
 return res
   .status(200)
   .json({ message: "The password is changed succesfully" });
 
})

export {
  Register,
  Login,
  userProfile,
  userUpdate,
  logout,
  verfiyEmail,
  verifying_user,
  forgettenPassword,
  restPssword,
  ChangePassword,
  loggedstatus,
};
