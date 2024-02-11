import UserModel from "../Modals/User.model.js";
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken'

export const Register = async(req,res)=>{
  try{
      const{name,email,password} = req.body.userData;
      if(!name || !email  || !password)return res.status(401).json({success:false,message:"all data is mandotory"})
      
      const hashedPass = await bcrypt.hash(password,10)
      const user = new UserModel({
        name,email,password:hashedPass
      })
      await user.save()

      return res.status(200).json({success:true,message:"registration successfull..."})
  }catch(error){
    return res.status(500).json({success:false,message:error})
  }
}

export const Login = async(req,res)=>{
  try{
     const{email,password} = req.body.userData;
     if(!email || !password)return res.status(401).json({success:false,message:"all data is mandotory"})

     const user = await UserModel.findOne({email:email})
     if(!user)return res.status(401).json({success:false,message:"email not found"})

     const isPassCorrect = await bcrypt.compare(password,user.password)
     if(!isPassCorrect)return res.status(401).json({success:false,message:"password is not correct"})

     const token = await Jwt.sign({id:user._id},process.env.JWT_SECRETE)

     return res.status(200).json({success:true,message:"login succesfull..",user:{name:user.name,id:user._id},token})
  }catch(error){
    return res.status(500).json({success:false,message:error})
  }
}

export const getCurrentUser =async (req,res)=>{
  try{
      const {token}=req.body;
      if(!token)return res.status(401).json({success:false,message:"id not found"})

      const{id}=await Jwt.verify(token,process.env.JWT_SECRETE)

      const user = await UserModel.findById(id)
      if(!user)return res.status(401).json({success:false,message:"id not found"})

      return res.status(200).json({success:true,message:"user found",user:{name:user.name,id:user._id}})
  }catch(error){
    return res.status(500).json({success:false,message:error})
  }
}