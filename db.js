const mongoose=require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/omkar');
const db=mongoose.connection;

//Even listeners
db.on('connected',()=>{
    console.log('Connected to MongoDB server');
})

db.on('error',(err)=>{
    console.log('MongoDB connection error',err);
})
db.on('disconnected',()=>{
    console.log('MongoDB disconnected');
}
)
    
module.exports=db;