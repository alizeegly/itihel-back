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

exports.updateCourse = async (req, res) => {
    try{
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        res.status(200).json(updatedCourse)
    }catch(err){
        res.status(500).json(err)
    }
}

exports.deleteCourse = async (req, res) => {
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
}

exports.getOneCourse = async (req, res) => {
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
}

exports.getUserCourses = async (req, res) => {
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
}

exports.getUsersCourses = async (req, res) => {
    try{
        const courses = await Course.find(req.query).populate('owner_id')
        res.status(200).json(courses)
    } catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
}

exports.getPublicCourses = async (req, res) => {
    let query = { is_public: { $gte: true } }; // default query
    let queryParams = req.query; // query params from FE
    let protectedKeys = ['text']; // protected keys == not searchable/filterable
    let populate = [
        { path: 'owner_id', model: 'User' }
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
}

exports.getCourseCategories = async (req, res) => {
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
}

exports.postCourseCategory = async (req, res) => {
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
}

exports.deleteCourseCategory = async (req, res) => {
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
}