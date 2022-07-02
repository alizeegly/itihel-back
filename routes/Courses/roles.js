const router = require('express').Router()
const Role = require("../../models/Users/Role")

const {
    getOneRole,
    getAllRoles
} = require('../../controllers/Courses/RolesController');

/**
 * @method - GET
 * @param - /find/:id
 * @description - Role Get One
 */
router.get("/find/:id", getOneRole)

/**
 * @method - GET
 * @param - /
 * @description - Role Get All
 */
router.get("/", getAllRoles)


module.exports = router