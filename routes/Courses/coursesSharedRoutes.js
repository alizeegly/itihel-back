const router = require('express').Router()
const Course = require("../../models/Courses/Course")
const CourseShared = require("../../models/Courses/CourseShared")
const User = require("../../models/Users/User")
const mongoose = require('mongoose');
/**
 * @method - POST
 * @param - /
 * @description - Partage du cours à un user
 */
router.post("/", async (req, res) => {
    const newCourse = new CourseShared(req.body)
    try{
        const savedCourse = await newCourse.save()
        res.status(201).json(savedCourse)
    }catch(err){
        res.status(500).json(err)
    }
})

/**
 * @method - POST
 * @param - /:course
 * @description - Get all partage d'un cours
 */
 router.get("/course/:course", async (req, res) => {
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
})

/**
 * @method - POST
 * @param - /:cours
 * @description - Get all partage d'un user
 */
 router.get("/user/:user", async (req, res) => {
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
})

/**
 * @method - DELETE
 * @param - /:id
 * @description - User ne participe plus au cours
 */
 router.delete("/:id", async (req, res) => {
    try{
        await CourseShared.findByIdAndDelete(req.params.id)
        res.status(200).json("The course shared has been deleted with this user")
    } catch(err) {
        res.status(500).json(err)
    }
})

/**
 * @method - GET
 * @param - /:user and :course
 * @description - Get the roles of a user in a course
 */
 router.get("/:user/:course", async (req, res) => {
    try{
       await CourseShared
            .find({user_id: req.params.user, course_id: req.params.course})
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
})

/**
 * @method - PUT
 * @param - /:id
 * @description - Update des roles
 */
 router.put("/:id", async (req, res) => {
    try{
        const updatedCourse = await CourseShared.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        res.status(200).json(updatedCourse)
    } catch(err) {
        res.status(500).json(err)
    }
})



// DEPRECATED
/**
 * @method - POST
 * @param - /:user :course
 * @description - Update un rôle d'un user sur le cours
 */
 router.post("/:user/:course", async (req, res) => {
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
})

/**
 * @method - POST
 * @param - /:id
 * @description - Add un rôle d'un user sur le cours
 */
 router.post("/remove/:user/:course", async (req, res) => {
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
})

module.exports = router