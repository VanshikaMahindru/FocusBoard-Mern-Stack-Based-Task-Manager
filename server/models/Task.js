const { default: mongoose } = require('mongoose');
const moongose=require('mongoose');

const taskSchema=new mongoose.Schema(
    {
        title:{
            type:String,
            required: [true, 'Task title is required'],
            trim:true,
        },
        description:{
            type:String,
            trim:true,
            default: '',
        },
        priority:{
            type:String,
            enum:['Low','Medium','High'],
            default: 'Medium',
        },
        completed:{
            type:Boolean,
            default:false,
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
    },
    {timestamps:true}
);

module.exports = mongoose.model('Task',taskSchema);