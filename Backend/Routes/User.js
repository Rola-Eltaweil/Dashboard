import express from 'express'
import {
  Login,
  Register,
  userProfile,
  userUpdate,
  logout,
  verfiyEmail,
  verifying_user,
  forgettenPassword,
  restPssword,
  ChangePassword,
  loggedstatus,
} from "../controller/userauth.js";
import userauth from '../middleware/userauth.js'
const router=express.Router()

router.post('/register',Register)
router.post('/login',Login)
router.get("/userprofile", userauth, userProfile);
router.put("/userUpdate", userauth, userUpdate);
router.get('/logout',userauth,logout)
router.post('/verify-email',userauth,verfiyEmail)
router.post("/verifying_user/:verificationToken",verifying_user);
router.post("/forgetPssword", forgettenPassword);
router.post("/restPssword/:resetPasswordToken", restPssword);
router.post('/changePassword',userauth,ChangePassword)
router.get('/loggedstatus',loggedstatus)
export default router