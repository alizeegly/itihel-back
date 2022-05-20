const express = require("express");
const crypto = require("crypto")
const {
    check,
    validationResult
} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const router = express.Router();
const cookieParser = require('cookie-parser');

const User = require("../../models/Users/User");
const nodemailer = require('nodemailer');


const { registerUser, loginUser, logoutUser, authChecker } = require("../../controllers/userController");
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
 * @description - User SignIn
 */
 router.post("/login", loginLimiter, loginUser );
// router.post("/login", async (req, res) => {
//     const {
//         email,
//         pseudo,
//         password
//     } = req.body;
//     try {
//         let user
//         if(email){
//             user = await User.findOne({email});
//         } else if(pseudo){
//             user = await User.findOne({pseudo});
//         }
//         if (!user)
//             return res.status(400).json({
//                 message: "User Not Exist"
//             });
        
//         console.log(password)
//         console.log(user.password)

//         bcrypt.compare(password, user.password, (err, data) => {
//             if (err) throw err
//             console.log("data : " + data)
//             if (data) {
//                 const payload = {
//                     user: {
//                         id: user.id
//                     }
//                 };
    
//                 User.updateOne(user, {
//                     last_connection: Date.now()
//                 });
    
//                 jwt.sign(
//                     payload,
//                     "randomString", {
//                         expiresIn: 3600
//                     },
//                     (err, token) => {
//                         if (err) throw err;
//                         req.session.isAuth = true
//                         req.session.user = user
//                         req.session.token = token
    
//                         if(user.pseudo == "SUPER_ADMIN"){
//                             req.session.isAdmin = true
//                         } else {
//                             req.session.isAdmin = false
//                         }
                        
//                         console.log("Connected as", req.session.user.pseudo)
//                         // console.log(req.session)
    
//                         return res.status(200).json(
//                             req.session
//                         );
//                     }
//                 );
//                 // return res.status(200).json({ msg: "Login success" })
//             } else {
//                 return res.status(401).json({ message: "Invalid credencial" })
//             }

//         })
//     } catch (e) {
//         console.error(e);
//         console.log("Server Error")
//         res.status(500).json({
//             message: "Server Error"
//         });
//     }
// });

/**
 * @method - DELETE
 * @param - /logout
 * @description - User Logout
 */
//  router.get("/logout", async (req, res) => {
//     res.clearCookie()
//     console.log("------------------------------------------------")
//     console.log(req.session)
//     req.session.isAuth = false
//     req.session.user = null
//     req.session.token = ""
//     req.session.isAdmin = false
//     req.session.destroy((err) => {
//         console.log(logout)
//         if(err) {
//             return console.log(err);
//         }
//         res.status(500).json({
//             message: "Logout"
//         });
//     });
// })
router.delete("/logout", logoutUser );

/**
 * @method - GET
 * @param - /logout
 * @description - Check if user is Authenticated by reading session data
 */
router.get("/authchecker", authChecker );



















/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /me
 */
router.get("/me", 
async (req, res) => {
    try {
       console.log(req.session.user)
        const user = await User.findById(req.user.id)
        .populate('courses');
        res.json(user);
    } catch (e) {
        res.send({
            message: "Error in Fetching user"
        });
    }
});

/**
 * @method - GET
 * @description - Get User by Id
 * @param - /:id
 */
router.get("/find/:id", async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch(err) {
        res.status(500).json(err)
    }
});

/**
 * @method - PUT
 * @param - /:id
 * @description - User update
 */
 router.put("/:id", async (req, res) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        res.status(200).json(updatedUser)
    }catch(err){
        res.status(500).json(err)
    }
})

/**
 * @method - DELETE
 * @param - /:id
 * @description - User delete
 */
router.delete("/:id", async (req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("The user has been deleted")
    } catch(err) {
        res.status(500).json(err)
    }
})

/**
 * @method - GET
 * @param - /:id
 * @description - User's courses
 */
 router.get("/:id/courses", async (req, res) => {
    try{
        await User.findById(req.params.id)
            .populate({
                path : 'courses',
                // populate : {
                //     path : 'categories'
                // }
            })
            .exec(function(err, users) {
                if(err) {
                    console.log(err)
                } else {
                    res.status(200).json(users)
                }
            })
    }catch(err){
        res.status(500).json(err)
    }
})

/**
 * @method - GET
 * @param - /:id
 * @description - User's public courses
 */
 router.get("/:id/courses/public", async (req, res) => {
    try{
        await User.findById(req.params.id)
            .populate({
                path: 'courses',
                match: {
                    is_public: true
                }
            })
            .exec(function(err, users) {
                if(err) {
                    console.log(err)
                } else {
                    res.status(200).json(users)
                }
            })
    }catch(err){
        res.status(500).json(err)
    }
})

/**
 * @method - GET
 * @param - /:id
 * @description - User's private courses
 */
 router.get("/:id/courses/private", async (req, res) => {
    try{
        await User.findById(req.params.id)
            .populate({
                path: 'courses',
                match: {
                is_public: false
                }
            })
            .exec(function(err, users) {
                if(err) {
                    console.log(err)
                } else {
                    res.status(200).json(users)
                }
            })
    }catch(err){
        res.status(500).json(err)
    }
})

/**
 * @method - GET
 * @param - /
 * @description - Get All
 */
 router.get("/", async (req, res) => {
    try{
        const users = await User.find()
        res.status(200).json(users)
    } catch(err) {
        res.status(500).json(err)
    }
})








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