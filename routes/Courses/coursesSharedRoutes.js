const router = require('express').Router()
const mongoose = require('mongoose');

const Course = require("../../models/Courses/Course")
const CourseShared = require("../../models/Courses/CourseShared")
const User = require("../../models/Users/User")

const {
    postSharedCourse,
    getSharedCourse,
    getUserSharedCourses,
    deleteSharedCourseUser,
    getSharedCourseUserRole,
    putSharedCourseRoles,
    putSharedCourseUserRole,
    postSharedCourseUserRole
} = require('../../controllers/Courses/CoursesSharedController');

/**
 * @method - POST
 * @param - /
 * @description - Partage du cours à un user
 */
router.post("/", postSharedCourse)

/**
 * @method - POST
 * @param - /:course
 * @description - Get all partage d'un cours
 */
 router.get("/course/:course", getSharedCourse)

/**
 * @method - POST
 * @param - /:cours
 * @description - Get all partage d'un user
 */
 router.get("/user/:user", getUserSharedCourses)

/**
 * @method - DELETE
 * @param - /:id
 * @description - User ne participe plus au cours
 */
 router.delete("/:id", deleteSharedCourseUser)

/**
 * @method - GET
 * @param - /:user and :course
 * @description - Get the roles of a user in a course
 */
router.get("/:user/:course", getSharedCourseUserRole)

/**
 * @method - PUT
 * @param - /:id
 * @description - Update des roles
 */
 router.put("/:id", putSharedCourseRoles)



// DEPRECATED
/**
 * @method - POST
 * @param - /:user :course
 * @description - Update un rôle d'un user sur le cours
 */
 router.post("/:user/:course", putSharedCourseUserRole)

/**
 * @method - POST
 * @param - /:id
 * @description - Add un rôle d'un user sur le cours
 */
 router.post("/remove/:user/:course", postSharedCourseUserRole)

module.exports = router