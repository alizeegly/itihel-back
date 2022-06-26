const router = require('express').Router()
const Role = require("../../models/Users/Role")


/**
 * @method - GET
 * @param - /find/:id
 * @description - Role Get One
 */
router.get("/find/:id", async (req, res) => {
    try{
        const role = await Role.findById(req.params.id)
        res.status(200).json(role)
    } catch(err) {
        res.status(500).json(err)
    }
})

/**
 * @method - GET
 * @param - /
 * @description - Role Get All
 */
router.get("/", async (req, res) => {
    try{
        const roles = await Role.find()
        res.status(200).json(roles)
    } catch(err) {
        res.status(500).json(err)
    }
})


module.exports = router