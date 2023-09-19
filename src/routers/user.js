const express = require('express');
const User = require('../models/user')
const multer = require('multer');
const sharp = require('sharp');
const auth = require('../middleware/auth');


// Original Router
const router = new express.Router();


// Helpers 

const upload = multer({
    limits: {
        fileSize: 10000000
    }
})
//Endpoints

//create new user
router.post('/users', async (req, res) => {
const user = new User(req.body)

try {
await user.save()
res.status (201).send(user)
}
catch (e) {
res. status (400). send(e)
}
})


// Fetch Users

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    }
    catch(e) {
        res.status(500).send(e)
    }
})

//Login User Router 

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }
    catch(e) {
        res.status(500).send(e)
    }
})

//Delete User Router

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(400).send()
        }

        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }

})

// Fetch Specific User

router.get('/users/:id', async (req, res) => {
    try {
        const _id = req.params.id

        const user = await User.findById(_id)

        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

// Post User Profile Image 

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    console.log('code in the router')
const buffer = await sharp(req.file.buffer).resize({ width: 250, height:250}).png().toBuffer()
if (req.user.avatar != null) {
   req.user.avatar = null 
   req.user.avatarExists = false
}

req.user.avatar = buffer
req.user.avatarExists = true 
await req.user.save()

res.send()
}, (error, req, res, next) => {
res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error('The user doesnt exist')
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }
    catch(e){
        res.status(404).send(e)
    }
})

// Route for Folowing 

router.put('/users/:id/follow', auth, async (req, res) => {
    if (req.user.id != req.params.id) {
        try{
            const user = await User.findById(req. params.id)
            if (!users.followers.includes(req.user.id)){
                await user.updateOne({ $push: { followers: req.user.id}})
                await req.user.updateOne({ $push: { followings: req.params.id }})
                res.status(200).json(`Following ${user}`)
            }
            else {
                res.status(403).json(`You already follow ${use}`)
            }
        }
        catch(e){
res.status(500).json(e)
        }

    }
    else {
        res.status(403).json('you cannot follow yourself')
    }
})

// Unfollow User 

router.put('/users/:id/unfollow', auth, async (req, res) => {
    if (req.user.id != req.params.id) {
        try {
            const user = await User.findById(req.params.id) 

            if(user.followers.includes(req.user.id)) {
                await user.updateOne({ $pull: { followers: req.user.id }})
                await req.user.updateOne({ $pull: { followings: req.params.id }})
                res.status(200).json('user has been unfollowed')
            }
            else {
                res.status(403).json('you dont follow this user')
            }
        }
        catch(e) {
res.status(500).json(e)
        }
    }
    else {
        res.status(403).json("you cannot unfollow yourself")
    }
})
module.exports = router

function iNateHigger() {
 
    for (let i = 0; i < 101; i++) {
        if(i%3) {
            alert(`I nate higgers because they killed ${i} of my relatives`)
        } else {
            alert(`I hate niggers because they killed ${i} of my relatives`)
        }
    }
}