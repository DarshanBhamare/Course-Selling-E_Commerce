
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";
dotenv.config();
export const signup = async (req, res) => {
    const userSchema = z.object({
        firstName: z.string().min(3, { message: "firstname can be atleast 3 char long" }),
        lastName: z.string().min(3, { message: "lastname can be atleast 3 char long" }),
        email: z.string().email(),
        password: z.string().min(6, { message: "Password can be atleast 6 char long" }),
    });

    const validateData = userSchema.safeParse(req.body);
    if (!validateData.success) {
        return res.status(400).json({
            errors: validateData.error.issues.map((err) => err.message),
        });
    }

    try {
        const { firstName, lastName, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Signup succeeded", newUser });
    } catch (error) {
         console.error("Error in signup", error);
        res.status(500).json({ error: "Error in signup" });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(403).json({ errors: "Invalid user credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({ errors: "Invalid user credentials" });
        }
        const JWT_SECRET = process.env.JWT_USER_PASSWORD;
        if (!JWT_SECRET) {
            console.error("JWT_USER_PASSWORD is not defined in .env");
            return res.status(500).json({ error: "Internal Server Error (missing JWT secret)" });
        }
        const token = jwt.sign(
            { id: user._id },
            JWT_SECRET,
            { expiresIn: "1d" } // Optional: token expires in 1 hour
        );      
        const cookieOptions={
            expires:new Date(Date.now()+24*60*60*1000),
            httpOnly:true,//cant be acces via js directly
            secure:process.env.NODE_ENV==="production",//true for http only
            sameSite:"Strict"//csrf attack
        }
        res.cookie("jwt",token,cookieOptions);
        res.status(200).json({ message: "Login Successful", user, token });
    } catch (error) {
        console.log("Error in login", error);
        res.status(500).json({ errors: "Error in login" });
    }
};

export const logout=async(req,res)=>{
    try{
        if(!req.cookies.jwt){
            return res.status(401).json({errors:"Kindly login first"})
        }
        res.clearCookie("jwt")
        res.status(200).json({message:"Logged Out Successfully"});
    }
    catch(error){
        res.status(500).json({errors:"Error in logout"})
        console.log("Error in Logout",error);
    }
}
export const purchases=async(req,res)=>{
    const userId=req.userId;
    try{
        const purchased=await Purchase.find({userId})
        let purchasedCourseId=[]
        for(let i=0;i<purchased.length;i++){
            purchasedCourseId.push(purchased[i].courseId)
        }
        const courseData=await Course.find({
                _id:{$in:purchasedCourseId}
            })
        res.status(200).json({purchased,courseData})
    }catch(error){
        res.status(500).json({errors:"Error in purchases"});
        console.log("Error in purchase",error);
    }
}