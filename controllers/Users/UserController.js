const User = require("../../models/Users/User");

exports.findOne = (req,res,next) => {
    try{
        const user = User.findById(req.params.id)
        res.status(200).json(user)
    } catch(err) {
        res.status(500).json(err)
    }
};

exports.updateOne = (req,res,next) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        res.status(200).json(updatedUser)
    }catch(err){
        res.status(500).json(err)
    }
};

exports.deleteOne = (req,res,next) => {
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("The user has been deleted")
    } catch(err) {
        res.status(500).json(err)
    }
};

exports.publicCourses = (req,res,next) => {
    try{
        User.findById(req.params.id)
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
    } catch(err) {
        res.status(500).json(err)
    }
};

exports.privateCourses = (req,res,next) => {
    try{
        User.findById(req.params.id)
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
}

exports.courses = (req,res,next) => {
    try{
        User.findById(req.params.id)
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
}

exports.all = (req, res, next) => {
    try{
        const users = User.find()
        res.status(200).json(users)
    } catch(err) {
        res.status(500).json(err)
    }
}

exports.loggedUser = (req, res, next) => {
    try {
        const user = User.findById(req.session.user.id)
        .populate('courses');
        res.json(user);
    } catch (e) {
        res.send({
            message: "Error in Fetching user"
        });
    }
}