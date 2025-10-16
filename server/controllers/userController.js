import User from "../models/User";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const generateToken = (userId) =>{
    const token = jwt.sign({userId})
}   

export const registerUser = async(req,res) => {
    try {
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message : 'Missing required fields'})
        }


        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message : 'User already exists'})
        }


        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = await User.create({name,email,password : hashedPassword})


    } catch (error) {
        
    }
}