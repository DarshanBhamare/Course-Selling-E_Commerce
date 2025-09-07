import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { Admin} from "../models/admin.model.js";
export const signup = async (req, res) => {
    const adminSchema = z.object({
        firstname: z.string().min(3, { message: "firstname can be atleast 3 char long" }),
        lastname: z.string().min(3, { message: "lastname can be atleast 3 char long" }),
        email: z.string().email(),
        password: z.string().min(6, { message: "Password can be atleast 6 char long" }),
    });

    const validateData = adminSchema.safeParse(req.body);
    if (!validateData.success) {
        return res.status(400).json({
            errors: validateData.error.issues.map((err) => err.message),
        });
    }

    try {
        const { firstname, lastname, email, password } = req.body;
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ firstname, lastname, email, password: hashedPassword });
        await newAdmin.save();

        res.status(201).json({ message: "Signup succeeded", newAdmin });
    } catch (error) {
         console.error("Error in signup", error);
        res.status(500).json({ error: "Error in signup" });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const admin = await Admin.findOne({ email });
        
        if (!admin) {
            return res.status(403).json({ errors: "Invalid admin credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({ errors: "Invalid admin credentials" });
        }
        const JWT_SECRET = process.env.JWT_ADMIN_PASSWORD;
        if (!JWT_SECRET) {
            console.error("JWT_USER_PASSWORD is not defined in .env");
            return res.status(500).json({ error: "Internal Server Error (missing JWT secret)" });
        }
        const token = jwt.sign(
            { id: admin._id },
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
        res.status(200).json({ message: "Login Successful", admin, token });
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