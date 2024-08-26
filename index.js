const express=require('express');
const app=express();
const db=require('./db');
const User=require('./model/person.model.js');

const bodyParser=require('body-parser');
app.use(bodyParser.json()); //req.body

app.get('/test',(req,res)=>{
    res.send("{'API is working'}");
});

app.get('/',(req,res)=>{
    res.send('Home accessed')
})



//saving each user in database
app.post('/user',async(req,res)=>{
    
    try {
        const data=req.body;
        //creating new document using Mongoose Model
        const newUser=new User(data);
        //Saving the document in database
        const response=await newUser.save();
        console.log('data saved');
        //if successfully saved, below will be called
        res.status(200).json(response);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server Error'});
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

app.get('/middle',(req,res)=>{
    res.send('Middleware executed');
})
app.get('/middle2',(req,res)=>{
    res.send('executed');
})


app.listen(3000,()=>{
    console.log("listening server");
});

