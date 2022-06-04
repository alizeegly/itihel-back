const User = require("../../models/Users/User");
const Course = require("../../models/Courses/Course");
const CourseShared = require("../../models/Courses/CourseShared");

exports.findOne = (req,res,next) => {
    try{
        const user = User.findById(req.params.id)
        res.status(200).json(user)
    } catch(err) {
        res.status(500).json(err)
    }
};

exports.updateOne = (req,res,next) => {
    try{
        const updatedUser = User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        res.status(200).json(updatedUser)
    }catch(err){
        res.status(500).json(err)
    }
};

exports.deleteOne = (req,res,next) => {
    try{
        User.findByIdAndDelete(req.params.id)
        res.status(200).json("The user has been deleted")
    } catch(err) {
        res.status(500).json(err)
    }
};

exports.all = (req, res, next) => {
    try{
        const users = User.find()
        res.status(200).json(users)
    } catch(err) {
        res.status(500).json(err)
    }
}


// Courses
exports.publicCourses = (req,res,next) => {
    try{
        Course.find({owner_id: req.params.id, is_public: true})
        .exec(function(err, courses) {
            if(err) {
                console.log(err)
            } else {
                res.status(200).json(courses)
            }
        })
    } catch(err) {
        res.status(500).json(err)
    }
};

exports.privateCourses = (req,res,next) => {
    try{
        User.findById(req.params.id)
            .populate({
                path: 'courses',
                match: {
                    is_public: false
                }
            })
            .exec(function(err, users) {
                if(err) {
                    console.log(err)
                } else {
                    res.status(200).json(users)
                }
            })
    }catch(err){
        res.status(500).json(err)
    }
}

exports.courses = (req,res,next) => {
    try{
        Course.find({owner_id: req.params.id})
            .populate("owner_id")
            .exec(function(err, courses) {
                if(err) {
                    console.log(err)
                } else {
                    res.status(200).json(courses)
                }
            })
    }catch(err){
        res.status(500).json(err)
    }
}

exports.sharedCourses = (req, res, next) => {
    try{
        let coursesArray = []
        CourseShared.find({user_id: req.params.id})
            .populate('roles')
            .populate('course_id')
            .populate({
                path : 'course_id',
                populate : {
                    path : 'owner_id'
                }
            })
            .exec(function(err, courses) {
                if(err) {
                    console.log(err)
                } else {
                    courses.forEach(courseShared => {
                        if(!courseShared.roles.includes("618702283f5059816c261d99")){
                            coursesArray.push(courseShared.course_id)
                        }
                    });
                    res.status(200).json(coursesArray)
                }
            })
    } catch(err) {
        res.status(500).json(err)
    }
}
