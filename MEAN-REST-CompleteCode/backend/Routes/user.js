const express=require('express')
const Router= express.Router()
const bcrypt=require('bcryptjs')
const User= require('../Model/userDB')
const jwt= require('jsonwebtoken')

Router.post('/signup',(req,res,next)=>{
    bcrypt.hash(req.body.password,10).then(hash=>{
        console.log('reached server for adding user')
        const user= new User({
            email: req.body.email,
            password: hash
    })
    user.save().then(result=>{
        console.log(result)
        res.status(201).json({
            message: "User Added!",
            result: result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
   })
})

Router.post('/login',(req,res,next)=>{
    let fetchedUser;
    User.findOne({email: req.body.email}).then(user=>{
        if(!user){
            return res.status(401).json({
                message: 'No user found'
            })
        }
        fetchedUser=user;
        return bcrypt.compare(req.body.password, user.password);
        })
        .then(result=>{
            if(!result){
                return res.status(401).json({
                    message: 'Wrong Password'}
                )}
            const token= jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},'long_long_reallyLong_string',{expiresIn:'1h'} )
            res.status(200).json({
                message: 'Logged in!',
                token:token,
                expiresIn: 3600,
                userId: fetchedUser._id
            })
            })
        .catch(err=>{
            return res.status(401).json({
                error:err
            })
        })

});

module.exports=Router