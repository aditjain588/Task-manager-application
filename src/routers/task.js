const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

// adds a new task to database
router.post('/task',auth,  async (req, res) => {
    // const task = new Task(req.body)
    
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save()
        res.send(task)
    }catch (e) {
        res.status(400).send(e)
    }

    // task.save().then(() => {
    //     res.send(task)
    // }).catch((err) => {
    //     res.status(400).send(err)
    // })
})

// gets all the tasks
// completed
// limit, skip
// sortBy 

router.get('/tasks', auth, async (req, res) => {
    
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)

    } catch (e) {
        res.status(500).send()
    }
})

// gets task with specifeid id
router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id

    try{
        // const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner: req.user._id})

        if(!task){
            res.status(404).send()
        }
        res.send(task)

    } catch (e){
        console.log(e)
        res.status(201).send(e)
    }
})


// updates information of a task by id.
router.patch('/tasks/:id', auth ,async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed = ["description", "completed"]
    const isValid = updates.every((update) => allowed.includes(update))

    if(!isValid){
        return res.status(400).send({error: 'Invalid operation'})
    }

    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        
        if(!task){
            return res.status(400).send()
        }
        updates.forEach((update) => task[update] = req.body[update])  
        await task.save()

        res.send(task)
    } catch (e) {
        return res.status(400).send()
    }
})

// delete task by id
router.delete('/tasks/:id', auth, async (req, res) => {

    try{
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    } catch (e){
        res.status(500).send()
    }
})

module.exports = router