import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import morgan from "morgan";
import cors from "cors";
import Connect_DB from "./config/Database.js";
import Users from './Routes/User.js'
import Admin from './Routes/Admin.js'
import Tasks from './Routes/Task.js'
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));

const corsoptions = {
  origin: [process.env.FRONTEND_URL, process.env.FRONTENDTWO_URL],
  credentials:true,
};
app.use(cors(corsoptions));
app.use(cookieParser())

Connect_DB();
app.use('/api',Users)
app.use('/api',Admin)
app.use('/api',Tasks)

const PORT = process.env.PORT;
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("application listen to database sucsessfully");
  }
});
