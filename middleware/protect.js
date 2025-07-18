const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const staff = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/staffs.json'), 'utf8')
);

exports.protect = async(req,res,next) =>{
    //DESTRUCTURE AUTHRIZATION FROM REQ.HEADERS
   const {authorization} = req.headers

   //IF AUTHORIZATION DOSENT EXIST AND IF IT DOSENT START WITH BEARER
   if(!authorization && !authorization?.startsWith('Bearer')){
     
       return res.status(401).json('You are not authorized')
   }

   //GET TOKEN
   const token = authorization.split(' ')[1]
   
  
   //CHECK IF TOKEN EXIST
   if(!token){ 
    return res.status(401).json('You are not authorized')
   }

   //VERIFY TOKEN
   try{
       const {id} = jwt.verify(token,process.env.ATS)
        const user = staff.find(u => u.id === id);
       
     //IF USER DOSENT EXIST
     if(!user){
         return res.status(401).json('You are not authorized')
        }

        req.user = user

        next()
        
    }catch(err){
    res.status(401).json('You are not authorized')
   }

}