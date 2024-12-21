const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const signup = new Schema({
    username:{
        type:String,
        requires:true,
        unique:true
    },
    password:{
        type:String,
        requires:true
    },
    cpassword:{
        type:String,
        requires:true
    }
})

const sschema = mongoose.model('signup-schema',signup)
module.exports = sschema;