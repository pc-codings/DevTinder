const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    firstName:{
        type: 'string',
        required: true,
        trim: true,
        minLength:4,
        maxLength:30
    },
    lastName:{
        type: 'string',
        required: true,
        trim: true,
        minLength:4,
        maxLength:30
    },
    emailId:{
        type: 'string',
        required: true,
        trim: true,
        minLength:4,
        maxLength:30,
        unique: true,
        toLowerCase: true
    },
    password:{
        type: 'string',
        required: true,
    },
    age:{
        type: 'number',
        min:18,
        trim: true,
    },
    gender:{
        type: 'string',
        validate(value){
            if(!['male','female'].includes(value)){
                throw new Error('Invalid gender');
            }
        }
    },
    skills:{
        type:[String]
    },
    photoUrl:{
        type: 'string',
        trim:true,
        default: 'https://i.pinimg.com/736x/55/0f/49/550f49a459548599a5a4ea1c67fc0244.jpg'
    }
},{ timestamps: true });

const User = mongoose.model('User',userSchema);

module.exports = User;