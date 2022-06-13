const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let AuditorSchema =  new Schema({
    username : {type: String, required:true},
    userAction : {type:String, required:true},
    userIP:{type:String, required:true} ,
    logDate : {type: Date, default: Date.now},
})

AuditorSchema.set('toJSON', { virtuals: false,versionKey:false });

module.exports = mongoose.model('Auditor', AuditorSchema);