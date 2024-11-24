import mongoose from "mongoose"
const ConnectDatabase=async()=>{
try{
     const connect = await mongoose.connect(process.env.DataBase_url);
 if(connect){
    console.log('Connect DataBase succsesfully')
 }
}catch(err){
  console.log('error')
}
}

export default ConnectDatabase;