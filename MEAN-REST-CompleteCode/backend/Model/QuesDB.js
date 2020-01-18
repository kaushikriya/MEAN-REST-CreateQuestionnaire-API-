const mongoose=require('mongoose')

const quesSchema=mongoose.Schema({
    que: {type: String, required: true},
    ans: {type: String, required: true},
    imagePath: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports= mongoose.model('Que', quesSchema)