const Joi = require('@hapi/joi');

const email = Joi.string().email({ minDomainSegments: 2}).min(8).max(70).required().messages({
    'string.email': `Not a Valid E-mail, valid emails are of the form name@domain.tld `,
    'string.empty': `E-mail cannot be an empty field`,
    'string.min': `E-mail should have a minimum length of {#limit}`,
    'string.max': `E-mail should have a maximum length of {#limit}`,
});

const password = Joi.string().min(4).max(16).pattern(/^[a-zA-Z0-9]/).required().messages({
    'string.pattern.base': `Password can only contain upper case and lower case characters and numbers`,
    'string.empty': `Password cannot be an empty field`,
    'string.min': `Password should have a minimum length of {#limit}`,
    'string.max': `Password should have a maximum length of {#limit}`,
})

const first_name = Joi.string().min(3).max(30).required().messages({
    'string.base': `Your first name can only contain lower and uppercase letters and apostrophes`,
    'string.empty': `First name cannot be an empty field`,
    'string.min': `First name should have a minimum length of {#limit}`,
    'string.max': `First name should have a maximum length of {#limit}`,
});

const last_name = Joi.string().min(3).max(30).required().messages({
    'string.base': `Your last name can only contain lower and uppercase letters and apostrophes`,
    'string.empty': `Last name cannot be an empty field`,
    'string.min': `Last name should have a minimum length of {#limit}`,
    'string.max': `Last name should have a maximum length of {#limit}`,
});

const pseudo = Joi.string().min(4).max(30).required().messages({
    'string.base': `Your Pseudo can only contain lower and uppercase letters and apostrophes`,
    'string.empty': `Pseudo cannot be an empty field`,
    'string.min': `Pseudo should have a minimum length of {#limit}`,
    'string.max': `Pseudo should have a maximum length of {#limit}`,
});

exports.loginSchema = Joi.object({ email, password});

exports.registerSchema = Joi.object({ first_name, last_name, pseudo, email, password});