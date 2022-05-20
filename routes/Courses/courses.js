const router = require('express').Router()
const mongoose = require('mongoose');
const Course = require("../../models/Courses/Course")
const Quiz = require("../../models/Quizz/Quiz")
const Category = require("../../models/Courses/Category")
const CourseShared = require("../../models/Courses/CourseShared")
const User = require("../../models/Users/User")
const Role = require("../../models/Users/Role")
const auth = require("../../middleware/auth")

/**
 * @method - POST
 * @param - /
 * @description - Course create
 */
router.post("/", async (req, res) => {
    try{
        const newCourse = new Course(req.body)
        newCourse.save()
        
        User.findOne({_id: mongoose.Types.ObjectId(req.body.owner_id)}, function(err, user) {
            if (err) return console.log(err)
            user.courses.push(newCourse._id)
            user.save()
        });

        const role_admin = await Role.findById("618702283f5059816c261d99")
        const newCourseShared = new CourseShared({
            course_id: newCourse._id,
            user_id: newCourse.owner_id,
            roles: [role_admin._id]
        })
        newCourseShared.save()
        
        res.redirect("/api/courses")
    }catch(err){
        res.status(500).json(err)
    }
})

/**
 * @method - PUT
 * @param - /:id
 * @description - Course update
 */
router.put("/:id", async (req, res) => {
    try{
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        res.status(200).json(updatedCourse)
    }catch(err){
        res.status(500).json(err)
    }
})

/**
 * @method - DELETE
 * @param - id, user
 * @description - Course delete et delete dans user
 */
router.delete("/:id/:user", async (req, res) => {
    try{
       await Course.findByIdAndDelete(req.params.id)

        await User.findByIdAndUpdate(req.params.user, 
            { $pull: { courses: mongoose.Types.ObjectId(req.params.id)} },
            { new: true }
        )

        await CourseShared.deleteOne({ course_id: req.params.id });

        res.redirect("/api/courses")
    } catch(err) {
        res.status(500).json(err)
    }
})

/**
 * @method - GET
 * @param - /find/:id
 * @description - Get One Course
 */
router.get("/find/:id", async (req, res) => {
    try{
        const course = await Course
        .findById(req.params.id)
        .populate("owner_id")
        .populate("categories")
        .populate("quiz")
        res.status(200).json(course)
    } catch(err) {
        res.status(500).json(err)
    }
})


/**
 * @method - GET
 * @param - /find/:id
 * @description - Get Courses of a user
 */
 router.get("/user/:id", async (req, res) => {
    try{
        const courses = await Course.find({owner_id: req.params.id }).populate("owner_id")
        res.status(200).json(courses)
        // const course = await Course
        // .find({owner_id: req.params.id }, function(err,courses) { 
        //     console.log(err)
        //     res.status(200).json(courses)
        // })
    } catch(err) {
        res.status(500).json(err)
    }
})


/**
 * @method - GET
 * @param - /
 * @description - Get All courses of all Users
 */
router.get("/", async (req, res) => {
    try{
        const courses = await Course.find(req.query).populate('owner_id')
        res.status(200).json(courses)
    } catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
})

/**
 * @method - GET
 * @param - /:id
 * @description - Get all public courses
 */
 router.get("/public", async (req, res) => {
    let query = { is_public: { $gte: true } }; // default query
    let queryParams = req.query; // query params from FE
    let protectedKeys = ['text']; // protected keys == not searchable/filterable
    let populate = [
        { path: 'owner_id', model: 'User' },
        { path: 'categories', model: 'Category' }
    ]

    try{
        await Course
        .findAndFilter(query, queryParams, protectedKeys, populate,
            (err, courses) => {
              if (err) return next(err);
              res.status(200).json(courses);
        })
        .then((courses) => {
            res.status(200).json(courses);
        })
        .catch((err) => {
            return next(err);
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

/**
 * @method - GET
 * @param - course
 * @description - Get All categories of one course
 */
 router.get("/:course/categories", async (req, res) => {
    try{
        await Course.findById(req.params.course)
            .populate("categories")
            .exec(function(err, categories) {
                if(err) {
                    console.log(err)
                } else {
                    res.status(200).json(categories)
                }
            })
    } catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
})

/**
 * @method - POST
 * @param - course
 * @description - Add a categorie to a course
 */
 router.post("/:course/categories", async (req, res) => {
    try{
        const newCategory = Category.findById(req.body.category)
        const newCourse = Course.findById(req.params.course)

        // Ajout de la catégorie dans le tableau categories du cours
        Course.findOne({_id: mongoose.Types.ObjectId(req.params.course)}, function(err, course) {
            if (err) return console.log(err)
            if(course.categories.includes(mongoose.Types.ObjectId(req.body.category))){ // Si le cours possède déjà la catégorie
                console.log("categorie deja existante")
            } else {
                course.categories.push(mongoose.Types.ObjectId(req.body.category))
                course.save()
            }
        })
        // Ajout du cours dans le tableau courses de la catégorie
        Category.findOne({_id: mongoose.Types.ObjectId(req.body.category)}, function(err, category) {
            if (err) return console.log(err)
            if(category.courses.includes(mongoose.Types.ObjectId(req.params.course))){ // Si la catégorie possède déjà le cours
                console.log("cours deja existant")
                res.status(500).json({"message": "error"})
            } else {
                category.courses.push(mongoose.Types.ObjectId(req.params.course))
                category.save()   
                res.redirect("/api/courses/" + req.params.course + "/categories")
            }
        })
    } catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
})

/**
 * @method - DELETE
 * @param - course
 * @description - Delete a categorie to a course
 */
 router.put("/:course/categories", async (req, res) => {
    try{
        await Course.findByIdAndUpdate(req.params.course, 
        { $pull: { categories: mongoose.Types.ObjectId(req.body.category)} },
        { new: true }
        )
        res.redirect("/api/courses/" + req.params.course + "/categories")
    } catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
})


module.exports = router