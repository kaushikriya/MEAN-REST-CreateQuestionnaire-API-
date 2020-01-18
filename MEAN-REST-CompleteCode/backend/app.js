const express= require('express');
const app=express();

const userRouter=require('./Routes/user')

const bodyParser=require('body-parser');

const quesRouter=require('./Routes/ques');

const mongoose= require('mongoose');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use("/images",express.static("backend/images"));

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin",'*');
    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Accept,Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,DELETE,PUT,PATCH,OPTIONS");
    next();
});

mongoose.connect("mongodb+srv://riya:harichand@meancourse-3ksb4.mongodb.net/QueMeanCourse?retryWrites=true&w=majority")
.then(()=>{
console.log('connected to database');
})
.catch((err)=>{
    console.log(err)
    console.log('Connection failed');
})

app.use("/api/ques/",quesRouter);
app.use('/api/user/', userRouter);


module.exports=app;