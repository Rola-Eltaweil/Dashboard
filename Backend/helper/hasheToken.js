
import crypto from "node:crypto";

const hashToken=(token)=>{
    //hashing by sha256 
 return crypto.createHash('sha256').update(token.toString()).digest('hex')
}

export default hashToken