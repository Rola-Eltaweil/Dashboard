import express from "express";
import {adminauth, creatorauth} from "../middleware/adminauth.js";
import { Deleteuser, Allusers } from "../controller/Admin.js";
import userauth from "../middleware/userauth.js";
const router=express.Router()

router.delete("/admin/user/:id", userauth,adminauth, Deleteuser);
router.get("/users", userauth, creatorauth, adminauth, Allusers);

export default router;