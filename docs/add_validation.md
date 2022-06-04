# Ajouter une validation pour un form
- Dans le dossier utils, créer un fichier test Validations.js
- Dans celui-ci, appelé la library Joi :
````
const Joi = require('@hapi/joi');
````
> Documentation de Joi : [https://joi.dev/api/?v=17.6.0](https://joi.dev/api/?v=17.6.0)
- Pour chaque champs d'un formulaire qui nécéssite une validation ajouter une variable de la sorte :
````
const email = Joi.string().email({ minDomainSegments: 2}).min(8).max(70).required().messages({
    'string.email': `Not a Valid E-mail, valid emails are of the form name@domain.tld`,
    'string.empty': `E-mail cannot be an empty field`,
    'string.min': `E-mail should have a minimum length of {#limit}`,
    'string.max': `E-mail should have a maximum length of {#limit}`,
});
````
- Export selon les forms que l'on souhaitent avec les champs nécéssaires :
````
exports.loginSchema = Joi.object({ email, password});

exports.registerSchema = Joi.object({ first_name, last_name, pseudo, email, password});
````
- Dans le controller, vérifier les données du form réçues en appelant la bibliothèque joi. Pour cela récupérer les schémas du points précédant
````
const { email, password } = req.body;
const result = loginSchema.validate({ email, password});
````
- Si il y a des erreurs dans la validation, on peut les vérifier avec: 
````
if(result.error) {
    return res
        .status(400)
        .json(...);
}
````