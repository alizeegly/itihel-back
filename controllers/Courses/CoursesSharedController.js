const mongoose = require("mongoose");
const Course = require("../../models/Courses/Course");
const CourseShared = require("../../models/Courses/CourseShared");
const User = require("../../models/Users/User")

exports.postSharedCourse = async (req, res) => {
    console.log(req.body)
    try{
        const user = await User.findOne({pseudo: req.body.user_id})
        const courseShared = {
            course_id: mongoose.Types.ObjectId(req.body.course_id),
            user_id: mongoose.Types.ObjectId(user._id),
            roles: req.body.roles
        }
        console.log(courseShared)
        const newCourse = await CourseShared.create(courseShared)
        const savedCourse = await newCourse.save()
        res.status(201).json({msg: "Le cours a bien été partagé"})
    }catch(err){
        res.status(500).json(err)
    }
}

exports.getSharedCourse = async (req, res) => {
    try{
        await CourseShared
            .find({course_id: req.params.course})
            .populate('roles')
            .populate('course_id')
            .populate('user_id')
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
}

exports.getUserSharedCourses = async (req, res) => {
    try{
        await CourseShared
            .find({user_id: req.params.user})
            .populate('roles')
            .populate('course_id')
            .populate({
                path : 'course_id',
                populate : {
                    path : 'owner_id'
                }
            })
            .populate('user_id')
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
}

exports.deleteSharedCourseUser = async (req, res) => {
    try{
        await CourseShared.findByIdAndDelete(req.params.id)
        res.status(200).json("The course shared has been deleted with this user")
    } catch(err) {
        res.status(500).json(err)
    }
}

exports.getSharedCourseUserRole = async (req, res) => {
    try{
        await CourseShared
            .find({user_id: req.params.user, course_id: req.params.course})
            .populate('roles')
            .exec(function(err, courses) {
                if(err) {
                    res.status(500).json(err)
                } else {
                    if(courses.length <= 0){
                        res.status(200).json([])
                    } else {
                        res.status(200).json(courses[0].roles)
                    }
                }
            })
    } catch(err) {
        res.status(500).json(err)
    }
}

exports.putSharedCourseRoles = async (req, res) => {
    try{
        const updatedCourse = await CourseShared.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        res.status(200).json(updatedCourse)
    } catch(err) {
        res.status(500).json(err)
    }
}

exports.putSharedCourseUserRole = async (req, res) => {
    try{
        var courseShared = await CourseShared.findOne({ course_id: mongoose.Types.ObjectId(req.params.course), user_id: mongoose.Types.ObjectId(req.params.user) })

        var hasRole = await courseShared.roles.some(function (role) {
            return role.equals(req.body.roles);
        });

        // If the courseShared already has the role, we remove it
        if(hasRole){
            CourseShared.findOneAndUpdate(
                { course_id: mongoose.Types.ObjectId(req.params.course), user_id: mongoose.Types.ObjectId(req.params.user) },
                { $pull: { roles: req.body.roles } },
                function (error, success) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.redirect("/api/courses-shared/" + req.params.user + "/" + req.params.course)
                    }
                }
            );
        } else { // if the courseShared doesn't have the role, we add it
            CourseShared.findOneAndUpdate(
                { course_id: mongoose.Types.ObjectId(req.params.course), user_id: mongoose.Types.ObjectId(req.params.user) },
                { $addToSet: { roles: req.body.roles } },
                function (error, success) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.redirect("/api/courses-shared/" + req.params.user + "/" + req.params.course)
                    }
                }
            );
        }
    } catch(err) {
        res.status(500).json(err)
    }
}

exports.postSharedCourseUserRole = async (req, res) => {
    try{
        CourseShared.findOneAndUpdate(
            {course_id: mongoose.Types.ObjectId(req.params.course), user_id: mongoose.Types.ObjectId(req.params.user)},
            { $pull: { roles: req.body.roles  } },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    // res.json(success);
                    res.redirect("/api/courses-shared/" + req.params.user + "/" + req.params.course)
                }
            }
        )
    } catch(err) {
        res.status(500).json(err)
    }
}