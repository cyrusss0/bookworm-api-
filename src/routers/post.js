const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const Post = require('../models/post');

const router = new express.Router();


const auth = require('../middleware/auth');

//Helper Functions

const upload = multer({
    limits: {
        fileSize: 1000000000
    }
})

router.post('/post', auth, async (req, res) => {
    const post = new Post({
        ...req.body,
        user: req.user._id
    })

    try {
        await post.save()
        res.status(201).send(post);
    }
    catch(err) {
res.status(400).send(err)
    }
})

// Add Image to Post Route

router.post('/uploadPostImage/:id', auth, upload.single('upload'), async (req, res)=> {
    const post = await Post.findOne({_id: req.params.id })
        console.log(post)

        if (!post) {
            throw new Error('Post not found')
        }

        const buffer = await sharp(req.file.buffer).resize({width: 350, height: 350}).png().toBuffer()
        post.image = buffer
        await post.save()
        res.send()


}, (error, req, res, next) => {
    res.status(400).send({error : error.message})
})

router.get('/posts', async (req, res) => {
    try {
const posts = await Post.find({})
res.send(posts)
    }
    catch(err) {
res.status(500).send(err)
    }
})

router.get('/posts/:id', async (req, res) => {

    const _id = req.params.id 

    try {
const posts = await Post.find({ user: _id})

if(!posts) {
    return res.status(404).send()
}

res.send(posts)
    }
    catch(err) {
res.status(500).send(err)
    }
})

// Fetch Post Image 

router.get('/posts/:id/image', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post && !post.image) {
throw new Error('Post image doesnt exist')
        }
        res.set('Content-Type', 'image/jpg')
        res.send(post.image)
    }
    catch (err) {
res.status(404).send(err)
    }
})

/// Like Post Func
router.put('/posts/:id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.user.id)) {
            await post.updateOne({ $push: { likes: req.user.id } });
            res.status(200).json("Liked Post");
        } else {
            res.status(403).json("Post already liked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Unlike Post Route
router.put('/posts/:id/unlike', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.includes(req.user.id)) {
            await post.updateOne({ $pull: { likes: req.user.id } });
            res.status(200).json("Post unliked");
        } else {
            res.status(403).json("Post already unliked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router