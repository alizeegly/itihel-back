const Joi = require('@hapi/joi');

const title = Joi.string().min(1).max(30).required().messages({
    'string.empty': `Le titre ne peut pas être un champ vide`,
    'string.min': `Le titre doit avoir une longueur minimum de {#limit}`,
    'string.max': `Le titre doit avoir une longueur maximum de {#limit}`,
});

const description = Joi.string().min(3).max(250).required().messages({
    'string.empty': `La description ne peut pas être un champ vide`,
    'string.min': `La description doit avoir une longueur minimum de {#limit}`,
    'string.max': `La description doit avoir une longueur maximum de {#limit}`,
});

exports.courseSchema = Joi.object({ title, description});
