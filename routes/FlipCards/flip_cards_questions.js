const router = require('express').Router()
const FlipCard = require("../../models/FlipCards/FlipCard")

/**
 * @method - POST
 * @param - /
 * @description - FlipCard create
 */
router.post("/create", async (req, res) => {
    const newFlipCard = new FlipCard(req.body)
    try{
        const savedFlipCard = await newFlipCard.save()
        res.status(201).json(savedFlipCard)
    }catch(err){
        res.status(500).json(err)
    }
})


/**
 * @method - PUT
 * @param - /:id
 * @description - FlipCard update
 */
router.put("/:id", async (req, res) => {
    try{
        const updatedFlipCard = await FlipCard.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        res.status(200).json(updatedFlipCard)
    }catch(err){
        res.status(500).json(err)
    }
})

/**
 * @method - DELETE
 * @param - /:id
 * @description - FlipCard delete
 */
router.delete("/:id", async (req, res) => {
    try{
        await FlipCard.findByIdAndDelete(req.params.id)
        res.status(200).json("The Flip Card has been deleted")
    } catch(err) {
        res.status(500).json(err)
    }
})

/**
 * @method - GET
 * @param - /find/:id
 * @description - FlipCard Get One
 */
router.get("/find/:id", async (req, res) => {
    try{
        const flipCard = await FlipCard.findById(req.params.id)
        res.status(200).json(flipCard)
    } catch(err) {
        res.status(500).json(err)
    }
})

/**
 * @method - GET
 * @param - /
 * @description - FlipCard Get All
 */
router.get("/", async (req, res) => {
    try{
        const flipCards = await FlipCard.find().populate("course_id")
        res.status(200).json(flipCards)
    } catch(err) {
        res.status(500).json(err)
    }
})

/**
 * @method - GET
 * @param - /
 * @description - FlipCard Get All from a course
 */
 router.get("/courses/:id", async (req, res) => {
    try{
        const flipCards = await FlipCard.find({course_id: req.params.id})
        res.status(200).json(flipCards)
    } catch(err) {
        res.status(500).json(err)
    }
})


module.exports = router