const bcrypt = require("bcryptjs");
const User = require("../../models/Users/User");
const {JWTSECRET} = require("../../config/config");
const Joi = require('@hapi/joi');
const { registerSchema, loginSchema } = require('../../utils/userValidations')
const jwt = require("jsonwebtoken");
var jwtSecret = JWTSECRET;

exports.auth2 = async (req, res) => {
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
    
    try {
        const result = registerSchema.validate({ first_name, last_name, pseudo, email, password});

        if(result.error && result.error.details){
            return res
                .status(400)
                .json({ msg: result.error.details[0].message });
        }

        const userExists = await User.findOne({
            $or: [
                {email: email},
                {pseudo: pseudo}
            ]
        });

        if (userExists) {
            res.status(400).json({ msg: "Un compte existe déjà avec ce pseudo ou cet email" });
        }
        
        const user = await User.create({
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

        jwt.sign(payload, jwtSecret, { expiresIn: "5 days" }, (err, token) => {
            if (err) throw err;
            res.json({  
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                pseudo: user.pseudo,
                email: user.email,
                token: token
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({msg: "Server error"});
    }
  
};


exports.loginUser = async(req, res) => {
    const { email, password } = req.body;
    const errors = []
    try {
        const result = loginSchema.validate({ email, password});
        if(result.error && result.error.details){
            return res
                .status(400)
                .json({ msg: result.error.details[0].message });
        }
        
        let user = await User.findOne({ email });

        if (!user) {
            return res
                .status(400)
                .json({ msg: "Email ou mot de passe introuvable" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res
                .status(400)
                .json({ msg: "Email ou mot de passe introuvable" });
        }

        //Return jsonwebtoken
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(payload, jwtSecret, { expiresIn: "5 days" }, (err, token) => {
            if (err) throw err;
            res.json({  
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                pseudo: user.pseudo,
                email: user.email,
                token: token
            });
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
  
