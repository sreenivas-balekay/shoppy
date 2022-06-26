const User = require('../models/user');
const { validationResult } = require('express-validator');
var jsonWebToken = require('jsonwebtoken');
//var expressJwt = require("express-jwt"); 
var { expressjwt: jwt } = require("express-jwt");


exports.signup = (req, res) => {

   const errors = validationResult(req);
   if(!errors.isEmpty()){
    return res.status(422).json({
        error: errors.array()[0].msg
    })
   }
   const user = new User(req.body);
   user.save((err, user) => {
    if(err){
        return res.status(400).json({
            err: "Not able to save user in DB"
        })
    };
    res.json({
        name: user.name,
        email: user.email,
        id: user._id
    });
   });
};


exports.signin = (req, res) => {
    const {email, password} = req.body;
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
       }

       console.log('UUUSer----1-', JSON.stringify(User))

       User.findOne({email}, (err, user) => {
        if(err || !user ){
           return res.status(400).json({
                error: 'user email does not exists'
            });
        };

        if(!user.authenticate(password)){
           return res.status(401).json({
                error: 'email and password do not match'
            })
        }

        // create token
        const token = jsonWebToken.sign({_id: user._id}, process.env.SECRET);

        //put token to cookie
        res.cookie("token", token, {expire: new Date() + 9999});

        // send response to frontend
        const {_id, name, role} = user;
        return res.json({token, user: {_id, name, email, role}})
       })

}

exports.signout = (req, res) => {

    // cookie-parser
    res.clearCookie("token")
    res.json({
        message: 'User signout successfully....'
    })
};

//protected routes
exports.isSignedIn = jwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'],
    userProperty: "auth"
    
})


//custom middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id === req.auth._id;
    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED"
        })
    }
    next()
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "You are not admin, Access denied"
        })
    }
    next()
}

