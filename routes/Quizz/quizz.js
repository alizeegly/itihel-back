const router = require('express').Router()
const Quiz = require("../../models/Quizz/Quiz")

const {
    postQuizz,
    putQuizz,
    deleteQuizz,
    getOneQuizz,
    getCourseQuizz,
    getAllQuizz
} = require('../../controllers/Games/QuizController');

/**
 * @method - POST
 * @param - /
 * @description - Quiz create
 */
router.post("/", postQuizz)

/**
 * @method - PUT
 * @param - /:id
 * @description - Quiz update
 */
router.put("/:id", putQuizz)

/**
 * @method - DELETE
 * @param - /:id
 * @description - Quiz delete
 */
router.delete("/:id", deleteQuizz)

/**
 * @method - GET
 * @param - /find/:id
 * @description - Quiz Get One
 */
router.get("/find/:id", getOneQuizz)

/**
 * @method - GET
 * @param - /find/:id
 * @description - Quiz Get Quiz of a course
 */
 router.get("/course/:id", getCourseQuizz)

/**
 * @method - GET
 * @param - /
 * @description - Quiz Get All
 */
router.get("/", getAllQuizz)


module.exports = router