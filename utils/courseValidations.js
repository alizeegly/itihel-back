const Joi = require('@hapi/joi');

const title = Joi.string().min(1).max(30).required().messages({
    'string.empty': `Title cannot be an empty field`,
    'string.min': `Title should have a minimum length of {#limit}`,
    'string.max': `Title should have a maximum length of {#limit}`,
});

const description = Joi.string().min(3).max(250).required().messages({
    'string.empty': `Description cannot be an empty field`,
    'string.min': `Description should have a minimum length of {#limit}`,
    'string.max': `Description should have a maximum length of {#limit}`,
});

exports.courseSchema = Joi.object({ title, description});
