const Joi = require('@hapi/joi');

const email = Joi.string().email({ minDomainSegments: 2}).min(8).max(70).required().messages({
    'string.email': `Ce n'est pas une adresse mail valide, elle doit avoir la forme name@domain.tld `,
    'string.empty': `L'adresse e-mail ne peut pas être un champ vide`,
    'string.min': `L'adresse e-mail doit avoir une longueur minimum de {#limit}`,
    'string.max': `L'adresse e-mail doit avoir une longueur maximum de {#limit}`,
});

const password = Joi.string().min(4).max(16).pattern(/^[a-zA-Z0-9]/).required().messages({
    'string.pattern.base': `Le mot de passe ne peut contenir que des minuscules, majuscules et chiffres`,
    'string.empty': `Le mot de passe ne peut pas être un champ vide`,
    'string.min': `Le mot de passe doit avoir une longueur minimum de {#limit}`,
    'string.max': `Le mot de passe doit avoir une longueur maximum de {#limit}`,
})

const first_name = Joi.string().min(3).max(30).required().messages({
    'string.base': `Le prénom ne peut contenir que des minuscules, majuscules et apostrophes`,
    'string.empty': `Le prénom ne peut pas être un champ vide`,
    'string.min': `Le prénom doit avoir une longueur minimum de {#limit}`,
    'string.max': `Le prénom doit avoir une longueur maximum de {#limit}`,
});

const last_name = Joi.string().min(3).max(30).required().messages({
    'string.base': `Le nom de famille ne peut contenir que des minuscules, majuscules et apostrophes`,
    'string.empty': `Le nom de famille ne peut pas être un champ vide`,
    'string.min': `Le nom de famille doit avoir une longueur minimum de {#limit}`,
    'string.max': `Le nom de famille doit avoir une longueur maximum de {#limit}`,
});

const pseudo = Joi.string().min(4).max(30).required().messages({
    'string.base': `Le pseudo ne peut contenir que des minuscules, majuscules et apostrophes`,
    'string.empty': `Le pseudo ne peut pas être un champ vide`,
    'string.min': `Le pseudo doit avoir une longueur minimum de {#limit}`,
    'string.max': `Le pseudo doit avoir une longueur maximum de {#limit}`,
});

exports.loginSchema = Joi.object({ email, password});

exports.registerSchema = Joi.object({ first_name, last_name, pseudo, email, password});