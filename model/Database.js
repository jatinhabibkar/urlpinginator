const mongoose = require('mongoose')

const Database =mongoose.Schema({
    link:{
        type:String,
        required:true
    },
    frequency:{
        type:Number,
        required:true
    },
    data:{
        type:[{ 
            timestamp:{
                type:Number,
            },
            status:{
                type:String,
                default:'err'
            },
            is_active:{
                type:Boolean,
                default:false
            }
        }],
        default:[]
    },
    date:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model('data',Database)
