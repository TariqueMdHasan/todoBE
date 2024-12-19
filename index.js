const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}))



app.get('/', (req, res)=>{
    res.send('Hello Tarique')
})

const TodoSchema = new mongoose.Schema({
    text: {type: String, required: true},
    // completed: {type: Boolean, default: false}
})

const Todo = mongoose.model('Todo', TodoSchema);

// CRUD Operation in Api

// Read
app.get('/api/todos', async(req, res)=>{
    try {
        const todos = await Todo.find();
        res.json(todos);
    }catch(error){
        res.status(500).send('Not able to fetch data')
    }
})

// Create
app.post('/api/todos', async(req, res)=>{
    try {
        if(!req.body.text){
            return res.status(400).send('Text is required');
        }
        const newTodo = new Todo({text: req.body.text});
        const savedTodo = await newTodo.save();
        res.json(savedTodo);
    } catch(error){
        res.status(500).send('Something is wrong')
    }
    
})

// Update
app.put('/api/todos/:id', async(req, res)=>{
    try{
        const todo = await Todo.findByIdAndUpdate(req.params.id,{
            text: req.body.text,
            completed: req.body.completed
        },
        {
            new: true,
            runValidators: true
        }
        );
        if(!todo){
            res.status(404).send('Todo does not exist')
        }
        // todo.completed = req.body.completed;
        // await todo.save();
        res.json(todo);
    }catch(error){
        res.status(500).send('Something is wrong for edit')
    }
});

// Delete
app.delete('/api/todos/:id', async(req, res)=>{
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if(!todo){
            res.status(404).send('todo does not exist')
        }
        res.json({message: 'message deleted successfully'})
    }catch(error){
        res.status(500).send('somethig went wrong for deletion')
    }
})


app.listen(5000, async (req, res)=>{
    try{
        await mongoose.connect('mongodb+srv://tarique:tarique@cluster0.vsz99.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        .then(()=>console.log('mongodb connected successfully'))
        .catch((error)=>console.log(error))
    }catch(error){
        console.log('Something went wrong', error)
    }
    
})