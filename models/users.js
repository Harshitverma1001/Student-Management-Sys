// Schema is a blueprint that defines the structure of the document (or record) in a MongoDB database. A schema specifies the fields that 
// a document can contain, their datatypes, and any validation rules or default values that should be applied.

// Definig the schema:
const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    created:{
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports=mongoose.model('User', userSchema);