const router = require('express').Router()
const mongoose = require('mongoose');

const Course = require("../../models/Courses/Course")
const Quiz = require("../../models/Quizz/Quiz")
const Category = require("../../models/Courses/Category")
const CourseShared = require("../../models/Courses/CourseShared")
const User = require("../../models/Users/User")
const Role = require("../../models/Users/Role");

const {
    createCourse,
    updateCourse,
    deleteCourse,
    getOneCourse,
    getUserCourses,
    getUsersCourses,
    getPublicCourses,
    getCourseCategories,
    postCourseCategory,
    deleteCourseCategory
} = require('../../controllers/Courses/CoursesController');

/**
 * @method - GET
 * @param - /
 * @description - Create a course
 */
router.post("/", createCourse );


/**
 * @method - PUT
 * @param - /:id
 * @description - Course update
 */
router.put("/:id", updateCourse)

/**
 * @method - DELETE
 * @param - id, user
 * @description - Course delete et delete dans user
 */
router.delete("/:id/:user", deleteCourse)

/**
 * @method - GET
 * @param - /find/:id
 * @description - Get One Course
 */
router.get("/find/:id", getOneCourse)


/**
 * @method - GET
 * @param - /find/:id
 * @description - Get Courses of a user
 */
 router.get("/user/:id", getUserCourses)


/**
 * @method - GET
 * @param - /
 * @description - Get All courses of all Users
 */
router.get("/", getUsersCourses)

/**
 * @method - GET
 * @param - /:id
 * @description - Get all public courses
 */
 router.get("/public", getPublicCourses)

/**
 * @method - GET
 * @param - course
 * @description - Get All categories of one course
 */
 router.get("/:course/categories", getCourseCategories)

/**
 * @method - POST
 * @param - course
 * @description - Add a categorie to a course
 */
 router.post("/:course/categories", postCourseCategory)

/**
 * @method - DELETE
 * @param - course
 * @description - Delete a categorie to a course
 */
 router.put("/:course/categories", deleteCourseCategory)


module.exports = router