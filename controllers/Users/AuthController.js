const bcrypt = require("bcryptjs");
const User = require("../../models/Users/User");
const {JWTSECRET} = require("../../config/config");
const Joi = require('@hapi/joi');
const { registerSchema, loginSchema } = require('../../utils/userValidations')
const jwt = require("jsonwebtoken");
var jwtSecret = JWTSECRET;


exports.isAuth = (req,res,next) => {
    const sessUser = req.session.user;
    if(sessUser) {
        next();
    } else {
        err = res.status(401).json({ msg: "You Need to Be Logged in to do this. Access Denied "})
        return err;
    }
};

exports.auth2 = async (req, res) => {
    console.log(req.user)
    try {
		const user = await User.findById(req.user.id).select("-password");
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
}


exports.registerUser = (req, res) => {
    const { first_name, last_name, pseudo, email, password } = req.body;
  
    const result = registerSchema.validate({ first_name, last_name, pseudo, email, password});

    if(!result.error) {
        // Check for existing user
        User.findOne({
            $or: [
                {email: email},
                {pseudo: pseudo}
            ]
        }).then((user) => {
            if (user) return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    
            //New User created
            const newUser = new User({
                first_name,
                last_name,
                pseudo,
                email,
                password
            });
    
            //Password hashing
            bcrypt.genSalt(12, (err, salt) =>
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
    
                newUser.password = hash;
                // Save user
                newUser
                    .save()
                    .then(() => {
                        const payload = {
                            user: {
                                id: newUser.id,
                            },
                        };
            
                        jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
                            if (err) throw err;
                            res.json({ token });
                        });
                    })
                    .catch((err) => console.log(err));
                })
            );
        });
    } else {
        res.status(422).json(result.error.details[0].message);
    }
  
};


exports.loginUser = async(req, res) => {
    // const { email, password } = req.body;
  
    // // basic validation
    // const result = loginSchema.validate({ email, password});
    // if(!result.error) {
    //     //check for existing user
    //     User.findOne({ email }).then((user) => {
    //         if (!user) return res.status(400).json({ errors: [{ msg: "Incorrect Email or Password" }] });
    
    //         // Validate password
    //         bcrypt.compare(password, user.password).then((isMatch) => {
    //             if (!isMatch) return res.status(400).json({ errors: [{ msg: "Incorrect Email or Password" }] });

    //             const payload = {
    //                 user: {
    //                     id: user.id,
    //                 },
    //             };
    
    //             jwt.sign(payload, jwtSecret, { expiresIn: "5000" }, (err, token) => {
    //                 if (err) throw err;
	// 			    res.json({ token });
    //             });
    //         });
    //     });
    // } else {
    //     console.log(result.error)
    //     res.status(422).json({ errors: [{msg: result.error.details[0].message}] });
    // }
    const { email, password } = req.body;

    try {
        // See if user exists
        let user = await User.findOne({ email });

        if (!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Email ou mot de passe introuvable" }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Email ou mot de passe introuvable" }] });
        }

        //Return jsonwebtoken
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(payload, jwtSecret, { expiresIn: "5 days" }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};


exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        // delete session data from store, using sessionID in cookie
        if (err) throw err;
        res.clearCookie("itihel"); // clears cookie containing expired sessionID
        res.json("Logged out successfully");
    });
}
  

exports.authChecker = (req, res) => {
    const sessUser = req.session.user;
    if (sessUser) {
        return res.json(sessUser);
    } else {
        return res.status(401).json({ msg: "Unauthorized" });
    }
};