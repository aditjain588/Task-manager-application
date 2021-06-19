const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

// adds a new user to database
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    const token = await user.generateAuthToken()
    try{
        await user.save()
        res.status(201).send({user, token})
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }

})

// user login
router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

// user logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()

    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()

    } catch (e) {
        res.status(500).send()
    } 

})

// gets all the users
router.get('/users/me', auth ,(req, res) => {
    res.send(req.user)
})

// updates information of specific user.
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedArray = ["name", "email", "password", "age"]
    const isValid = updates.every((update) => allowedArray.includes(update))

    if(!isValid){
        return res.status(400).send({error: 'Invalid operation'})
    }
    try{
        uddates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)

    } catch (e) {
        res.status(400).send(e)
    }
})

// deletes an user
router.delete('/users/me', auth, async (req, res) => {
    try{
        //const user = await User.findByIdAndDelete(req.user._id)
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("Please upload an image"))
        }

        cb(undefined, true)
    }
    
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //req.user.avatar = req.file.buffer
    const buffer = await sharp(req.file.buffer).png().toBuffer()
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// get profile pic of user using user ID.
router.get('/users/:id/avatar', async (req, res) => {
    
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router