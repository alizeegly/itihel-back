const FlipCard = require("../../models/FlipCards/FlipCard")

exports.postFlipCard = async (req, res) => {


    const newFlipCard = new FlipCard(req.body)
    
    try{
        const savedFlipCard = await newFlipCard.save()
        res.status(201).json(savedFlipCard)
    }catch(err){
        res.status(500).json(err)
    }
}

exports.putFlipCard = async (req, res) => {
    try{
        const updatedFlipCard = await FlipCard.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        res.status(200).json(updatedFlipCard)
    }catch(err){
        res.status(500).json(err)
    }
}

exports.deleteFlipCard = async (req, res) => {
    try{
        await FlipCard.findByIdAndDelete(req.params.id)
        res.status(200).json("The Flip Card has been deleted")
    } catch(err) {
        res.status(500).json(err)
    }
}

exports.getOneFlipCard = async (req, res) => {
    try{
        const flipCard = await FlipCard.findById(req.params.id)
        res.status(200).json(flipCard)
    } catch(err) {
        res.status(500).json(err)
    }
}

exports.getAllFlipCards = async (req, res) => {
    try{
        const flipCards = await FlipCard.find().populate("course_id")
        res.status(200).json(flipCards)
    } catch(err) {
        res.status(500).json(err)
    }
}

exports.getCourseFlipCards = async (req, res) => {
    try{
        const flipCards = await FlipCard.find({course_id: req.params.id})
        res.status(200).json(flipCards)
    } catch(err) {
        res.status(500).json(err)
    }
}