const rateLimit = require("express-rate-limit");


exports.registerLimiter = rateLimit({
    windowMs: 3 * 60 * 60 * 1000, // 3 hour window
    max: 3, // start blocking after 3 requests
    message: { errors: [{ msg: "Trop de comptes enregistrés depuis cet appareil, réessayez dans quelques heures" }] }
});

exports.loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 10, // start blocking after 5 requests
    message: { errors: [{ msg: "Trop de tentatives de connexion depuis cet appareil, réessayez dans quelques heures" }] }
});
