const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    age: {
        type: Number,
    },
    work: {
        type: String,
        enum: ['chef', 'waiter', 'manager'],

    }
})
const User=mongoose.model('User',personSchema);
module.exports=User;