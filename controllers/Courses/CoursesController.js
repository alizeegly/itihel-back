const mongoose = require("mongoose");
const Course = require("../../models/Courses/Course");
const CourseShared = require("../../models/Courses/CourseShared");
const Role = require("../../models/Users/Role");
const { courseSchema } = require('../../utils/courseValidations')

exports.createCourse = async (req,res,next) => {
    const { title, description } = req.body;
    const errors = []

    try{
        const result = courseSchema.validate({ title, description});
    
        if(result.error) {
            result.error.details.forEach(error2 => {
                errors.push({msg: error2.message})
            });
            return res
                .status(400)
                .json({ errors: errors });
        }

        const newCourse = new Course(req.body)
        await newCourse.save()
        
        const newCourseShared = new CourseShared({
            course_id: newCourse._id,
            user_id: newCourse.owner_id,
            roles: [mongoose.Types.ObjectId("618702283f5059816c261d99")]
        })
        await newCourseShared.save()
        
        res.json(newCourse);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
}