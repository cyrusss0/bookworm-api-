const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: Buffer
    },
    userId: {
type: mongoose.Schema.Types.ObjectId,
ref:'User',
requird: true,
    },
    likes: {
        type: Array,
        default: [],
    }
}, {
    timestamps: true
})

postSchema.methods.toJSON = function() {

    const post = this 

    const postObject = post.toObject()

    if(postObject.image) {
        postObject.image = "true"
    }

    return postObject
}

const Post = mongoose.model('Post', postSchema)

module.exports = Post