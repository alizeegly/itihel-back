const jwt = require("jsonwebtoken");
const {JWTSECRET} = require("../config/config");
const auth = require("../middlewares/auth");

module.exports = function (req, res, next) {
	//Get token from header
	const token = req.header("x-auth-token");

	//Check if there is no token in the header
	if (!token) {
		return res.status(401).json({ msg: "No token, authorization denied" });
	}

	//Verify token
	try {
		const decoded = jwt.verify(token, JWTSECRET);
		req.user = decoded.user;
		next();
	} catch (err) {
		res.status(401).json({ msg: "Token is not valid" });
	}
};