const express=require('express');
const app=express();
const db=require('./db');
const User=require('./model/person.model.js');
const bcryptjs=require('bcryptjs')
const bodyParser=require('body-parser');
require('dotenv').config();
const passport=require('./auth.js');
const { generateToken } = require('./jwt.js');

const {jwtAuthMiddleware}=require('./jwt.js');

app.use(passport.initialize());
app.use(bodyParser.json()); //req.body
const PassportMiddle=passport.authenticate('local',{session:false});





app.get('/test',PassportMiddle,function (req,res){
    res.send("{'API is working'}");
});

app.get('/',jwtAuthMiddleware,(req,res)=>{
    res.send('Home accessed')
})



//saving each user in database
app.post('/signup',async(req,res)=>{
    
    try {
        const {username,email,password}=req.body; 
        //creating new document using Mongoose Model
        const hashedPassword=bcryptjs.hashSync(password,10);

        const newUser=new User({
            username:username,
            password:hashedPassword,
            email:email,
        })
        //Saving the document in database
        
        const response=await newUser.save();
        console.log('data saved');

        //generating token
        const payload={
            id:response.id,   //_id==id here, mongoDB assumption
            username:response.username
        }

        console.log(JSON.stringify(payload));
        const token=generateToken(payload);
        console.log(token);

        //if successfully saved, below will be called
        res.status(200).json({response:response, token:token});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server Error'});
    }
})

//login

app.post('/login',async(req,res)=>{

    const {username,password}=req.body;
    try {
        const user=await User.findOne({username});
        if(!user) return res.status(401).json({error:"Invalid Username"});
        const passwordMatch=bcryptjs.compareSync(password,user.password);
        if(!passwordMatch) return res.status(401).json({error:"Invalid Password"});

        //creating & returning token to user
        const payload={
            id:user.id,
            username:user.username
        }

        const token=generateToken(payload);

        res.json({token});

    } catch (error) {
        return res.status(505).json({error:"internal server error"});
    }


})

//fetching user from database using GET Method
app.get('/users',async(req,res)=>{
    try {
        //finding all users
        const data=await User.find({});
        res.send(data);
    } catch (error) {
        console.log('Cant fetch data');
    }
})

//updating user

app.put('/users/:id',async(req,res)=>{

    try {
        const userId=req.params.id; //userId is extracted from param
        const ToUpdateUserData=req.body;//data that needs to update 

        const response= await User.findByIdAndUpdate(userId,ToUpdateUserData,{
            new:true, //gives updated User data
            runValidators:true,
        })

        if(!response){
            return res.status(404).json({error:'User not found'});
        }

        console.log('data updated');
        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server Error'});
    }
})
//deleting user 
app.delete('/users/:id',async(req,res)=>{
    try {
        const userId=req.params.id;
        const response=await User.findByIdAndDelete(userId);

        if(!response){
            return res.status(404).json('User not found');
        }

        console.log('user Deleted');
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(505).json({error:'Internal Server Error'});
    }
})

//middleware concept
const middle=(req,res,next)=>{
    console.log(`${new Date().toLocaleString()} req made at: ${req.originalURL}`)
    next(); //if not mention this, res will not be sent
}
app.use(middle);



const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("listening server");
});

