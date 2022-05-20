const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const User = require("../../models/Users/User");
const nodemailer = require('nodemailer');


const { registerUser, loginUser, logoutUser, authChecker } = require("../../controllers/Users/AuthController");
const { findOne, publicCourses, deleteOne, updateOne, privateCourses, courses, all, loggedUser } = require("../../controllers/Users/UserController");
const { registerLimiter, loginLimiter } = require("../../utils/rateLimiter");


/**
 * @method - POST
 * @param - /signup
 * @description - User register
 */
router.post("/signup", registerLimiter, registerUser );

/**
 * @method - POST
 * @param - /login
 * @description - User login
 */
 router.post("/login", loginLimiter, loginUser );

/**
 * @method - DELETE
 * @param - /logout
 * @description - User Logout
 */
router.delete("/logout", logoutUser );

/**
 * @method - GET
 * @param - /logout
 * @description - Check if user is Authenticated by reading session data
 */
router.get("/authchecker", authChecker );

/**
 * @method - GET
 * @description - Get User by Id
 * @param - /:id
 */
router.get("/find/:id", findOne );

/**
 * @method - PUT
 * @param - /:id
 * @description - User update
 */
router.put("/:id", updateOne );

/**
 * @method - DELETE
 * @param - /:id
 * @description - User delete
 */
router.delete("/:id", deleteOne);

 /**
  * @method - GET
  * @param - /:id
  * @description - User's public courses
  */
router.get("/:id/courses/public", publicCourses)

/**
 * @method - GET
 * @param - /:id
 * @description - User's private courses
 */
router.get("/:id/courses/private", privateCourses)

/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /me
 */
router.get("/me", loggedUser);


/**
 * @method - GET
 * @param - /:id
 * @description - User's courses
 */
router.get("/:id/courses", courses)

/**
 * @method - GET
 * @param - /
 * @description - Get All
 */
router.get("/", all)








// VOIR POUR MODIFIER ÇA : Ça ne marche plus

/**
 * @method - PUT
 * @param - /:id
 * @description - User update
 */
 router.put("/:id/reset-password", async (req, res) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);
        const updatedUser = await User.findByIdAndUpdate({ _id: req.params.id }, {
            password: password
        })
        res.status(200).json(updatedUser)
    }catch(err){
        res.status(500).json(err)
    }
})

router.post('/forgotPassword', async(req, res) => {
    console.log("")
    console.log("")
    console.log("")
    if (req.body.email === '') {
        console.log("email required")
        res.status(400).send('email required');
    }

    let range = {min: 100000, max: 999999}
    let delta = range.max - range.min
    const newPassword = Math.round(range.min + Math.random() * delta)
    console.log("newPassword : " + newPassword)

    bcrypt.genSalt(10, function(err, salt) {
        console.log("here")
        console.log(salt)
        bcrypt.hashSync(newPassword, salt, function(err, hash) {
            console.log("there")
            console.log(hash)
            User.findOneAndUpdate({ "email": req.body.email.email }, {"$set": {"password": hash}}, { returnNewDocument: true }).then(updatedDocument => {
                if(updatedDocument) {
                    console.log(`Mot de passe modifié`)
                } else {
                    console.log("No document matches the provided query.")
                }
                return updatedDocument
            })
            .catch(err => console.error(`Failed to find and update document: ${err}`))
        });
    });
    // const salt = await bcrypt.genSalt(10);
    // bcrypt.hash(newPassword, salt, function(err, hash) {
    //     console.log(hash)
    //     User.findOneAndUpdate({ "email": req.body.email.email }, {"$set": {"password": hash}}, { returnNewDocument: true }).then(updatedDocument => {
    //         if(updatedDocument) {
    //             console.log(`Mot de passe modifié`)
    //         } else {
    //             console.log("No document matches the provided query.")
    //         }
    //         return updatedDocument
    //     })
    //     .catch(err => console.error(`Failed to find and update document: ${err}`))
    // })
})




module.exports = router;



// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: "itihel.iim@gmail.com",
//         pass: "waitrxsfmvockhfm",
//     },
// });

// const mailOptions = {
//     from: 'itihel.iim@gmail.com',
//     to: updatedDocument.email,
//     subject: 'Link To Reset Password',
//     text:
//         'Vosu recevez ce mail parce que vous (ou quelqu\'un d\'autre avez fait la demande pour changer de mot de passe.\n\n'
//         + `Votre nouveau mot de passs est : ${newPassword}. Vous pouvez vous connecter à votre compte en l'utilisant.`
// };

// console.log('sending mail');

// transporter.sendMail(mailOptions, (err, response) => {
//     if (err) {
//         console.error('there was an error: ', err);
//     } else {
//         console.log('here is the res: ', response);
//         res.status(200).json('recovery email sent');
//     }
// });