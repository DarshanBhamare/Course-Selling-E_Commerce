import express from 'express';
import { buyCourses, courseDetails, createCourses, deleteCourse, getCourses, updateCourse } from '../controllers/course.controller.js';
import userMiddleware from '../middleware/user.mid.js';
import adminMiddleware from '../middleware/admin.mid.js';
const router=express.Router();
router.post("/create",adminMiddleware,createCourses )
router.put("/update/:courseId",adminMiddleware,updateCourse)
router.delete("/delete/:courseId",adminMiddleware,deleteCourse)
router.get("/courses",getCourses)
router.get("/:courseId",courseDetails)

router.post("/buy/:courseId",userMiddleware,buyCourses)
export default router ; 