const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        title:{
            type:String,
            requires:true
        },
        snippet:{
            type:String,
            requires:true
        },
        body:{
            type:String,
            requires:true
        },
        image:{
            type:String,
            requires:true
        }
    }
, { timestamps: true })

const mschema = mongoose.model('mschema' , schema)
module.exports = mschema;
