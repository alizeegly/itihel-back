const bcrypt = require("bcryptjs");
const User = require("../../models/Users/User");
const {JWTSECRET} = require("../../config/config");
const Joi = require('@hapi/joi');
const { registerSchema, loginSchema } = require('../../utils/userValidations')
const jwt = require("jsonwebtoken");
var jwtSecret = JWTSECRET;

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


exports.registerUser = async (req, res) => {
    const { first_name, last_name, pseudo, email, password } = req.body;
    const errors = []
    
    try {
        const result = registerSchema.validate({ first_name, last_name, pseudo, email, password});
    
        if(result.error) {
            result.error.details.forEach(error2 => {
                errors.push({msg: error2.message})
            });
            console.log(errors)
            return res
                .status(400)
                .json({ errors: errors });
        }
        // See if user exists
        let user = await User.findOne({
            $or: [
                {email: email},
                {pseudo: pseudo}
            ]
        });

        if (user) {
            res.status(400).json({ errors: [{ msg: "Un compte existe déjà avec ce pseudo ou cet email" }] });
        }
        user = new User({
            first_name,
            last_name,
            pseudo,
            email,
            password,
        });

        //Encrypt Password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        //Return jsonwebtoken
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
  
};


exports.loginUser = async(req, res) => {
    const { email, password } = req.body;
    const errors = []
    try {
        const result = loginSchema.validate({ email, password});
        if(result.error) {
            result.error.details.forEach(error2 => {
                errors.push({msg: error2.message})
            });
            return res
                .status(400)
                .json({ errors: errors });
        }
        
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
  
