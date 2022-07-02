const router = require('express').Router()
const FlipCard = require("../../models/FlipCards/FlipCard")

const {
    postFlipCard,
    putFlipCard,
    deleteFlipCard,
    getOneFlipCard,
    getAllFlipCards,
    getCourseFlipCards
} = require('../../controllers/Games/FlipcardsController');

/**
 * @method - POST
 * @param - /
 * @description - FlipCard create
 */
router.post("/create", postFlipCard)


/**
 * @method - PUT
 * @param - /:id
 * @description - FlipCard update
 */
router.put("/:id", putFlipCard)

/**
 * @method - DELETE
 * @param - /:id
 * @description - FlipCard delete
 */
router.delete("/:id", deleteFlipCard)

/**
 * @method - GET
 * @param - /find/:id
 * @description - FlipCard Get One
 */
router.get("/find/:id", getOneFlipCard)

/**
 * @method - GET
 * @param - /
 * @description - FlipCard Get All
 */
router.get("/", getAllFlipCards)

/**
 * @method - GET
 * @param - /
 * @description - FlipCard Get All from a course
 */
 router.get("/courses/:id", getCourseFlipCards)


module.exports = router