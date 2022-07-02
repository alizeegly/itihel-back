const mongoose = require("mongoose");
const Course = require("../../models/Courses/Course");
const CourseShared = require("../../models/Courses/CourseShared");
const Role = require("../../models/Users/Role");
const { courseSchema } = require('../../utils/courseValidations')

exports.getOneRole = async (req, res) => {
    try{
        const role = await Role.findById(req.params.id)
        res.status(200).json(role)
    } catch(err) {
        res.status(500).json(err)
    }
}

exports.getAllRoles = async (req, res) => {
    try{
        const roles = await Role.find()
        res.status(200).json(roles)
    } catch(err) {
        res.status(500).json(err)
    }
}