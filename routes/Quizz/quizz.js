const router = require('express').Router()
const Quiz = require("../../models/Quizz/Quiz")

/**
 * @method - POST
 * @param - /
 * @description - Quiz create
 */
router.post("/", async (req, res) => {
    const newQuiz = new Quiz(req.body)
    try{
        const savedQuiz = await newQuiz.save()
        Course.findOne({_id: mongoose.Types.ObjectId(newQuiz.course_id)}, function(err, course) {
            if (err) return console.log(err)
            course.quiz = savedQuiz
            course.save()
        });
        res.status(201).json(savedQuiz)
    }catch(err){
        res.status(500).json(err)
    }
})

/**
 * @method - PUT
 * @param - /:id
 * @description - Quiz update
 */
router.put("/:id", async (req, res) => {
    console.log(req.params.id)
    try{
        const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        res.status(200).json(updatedQuiz)
    }catch(err){
        res.status(500).json(err)
    }
})

/**
 * @method - DELETE
 * @param - /:id
 * @description - Quiz delete
 */
router.delete("/:id", async (req, res) => {
    try{
        await Quiz.findByIdAndDelete(req.params.id)
        res.status(200).json("The quiz has been deleted")
    } catch(err) {
        res.status(500).json(err)
    }
})

/**
 * @method - GET
 * @param - /find/:id
 * @description - Quiz Get One
 */
router.get("/find/:id", async (req, res) => {
    try{
        const quiz = await Quiz.findById(req.params.id)
        res.status(200).json(quiz)
    } catch(err) {
        res.status(500).json(err)
    }
})

/**
 * @method - GET
 * @param - /find/:id
 * @description - Quiz Get Quiz of a course
 */
 router.get("/course/:id", async (req, res) => {
    try{
        const quiz = await Quiz.find({course_id: req.params.id})
        res.status(200).json(quiz)
    } catch(err) {
        res.status(500).json(err)
    }
})

/**
 * @method - GET
 * @param - /
 * @description - Quiz Get All
 */
router.get("/", async (req, res) => {
    try{
        const quizz = await Quiz.find()
        res.status(200).json(quizz)
    } catch(err) {
        res.status(500).json(err)
    }
})


module.exports = router