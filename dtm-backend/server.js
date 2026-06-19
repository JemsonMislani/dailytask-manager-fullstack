const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const app = express()

app.use(cors({

    origin: [
        'http://localhost:5173',
        'https://dailytask-manager-fullstack.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use(express.json())

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})

// JWT middle ware.
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ message: "Invalid token format" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

// FOR USERS

// create user account
app.post('/createAcc', async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({message: 'Please fill out fields'})
        }
        const cleanEmail = email.toLowerCase().trim();
        const accExist = await pool.query('SELECT id FROM users WHERE email=$1', [cleanEmail])
        if(accExist.rows.length > 0){
            return res.status(400).json({message: 'Email already exist.'})
        }
        const hashedPw = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [cleanEmail, hashedPw]
        );
        const user = result.rows[0]

        const token = jwt.sign(
            {id: user.id}, 
            JWT_SECRET, 
            {expiresIn: '24h'}
        );
        return res.json({
            token,
            user: {id: user.id, email: user.email}
        })

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).send({message: 'Server Error', error});
    }
});

// create login, validate acc
app.post('/createLogin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const cleanEmail = email.toLowerCase().trim();
        const result = await pool.query('SELECT * FROM users WHERE email=$1', [ cleanEmail ])
        if(result.rows.length === 0){
            return res.status(400).json({message: 'User not found'})
        }

        const user = result.rows[0]
        if(!user.password){
            return res.status(500).json({message: 'Password is missing in Database'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'})
        }

        const token = jwt.sign(
            {id: user.id}, 
            JWT_SECRET, 
            {expiresIn: '24h'}
        );
        return res.json({
            token,
            user: {id: user.id, email: user.email}
        })
    } catch (error) {
        console.log('Login Error', error)
        res.status(500).send('Server Error')
    }
})

// create section
app.post('/createSection', verifyToken, async (req, res) => {

    try {

        const userId = req.user.id;
        const { title, description } = req.body;
        if(!title || !description){
            return res.status(400).json({message: 'Please fill out fields'})
        }
        const result = await pool.query('INSERT INTO sections (user_id, title, description) VALUES ($1, $2, $3) RETURNING *', [
            userId, title, description
        ])
        res.json(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

// FOR SECTION

// get section
app.get('/getSection', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query('SELECT * FROM sections WHERE user_id = $1 ORDER BY id ASC', [ userId ])
        res.json(result.rows)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

// get section title using id
app.get('/getSection/:id', verifyToken, async (req, res) => {
    
    try {
        const { id } = req.params
        const userId = req.user.id;
        const result = await pool.query('SELECT * FROM sections WHERE id = $1 AND user_id = $2', [ id, userId ])
        res.json(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

// edit section 
app.put('/editSection/:id', verifyToken,  async (req, res) => {

    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { title, description } = req.body
        const result = await pool.query('UPDATE sections SET title=$1, description=$2 WHERE id=$3 AND user_id=$4 RETURNING*', [
            title, description, id, userId
        ])
        if(result.rows.length === 0){
            return res.status(404).json({message: 'Section not found'})
        }
        res.json(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

// delete section
app.delete('/deleteSection/:id', verifyToken, async(req, res) => {

    try {
        const { id } = req.params;
        const userId = req.user.id;
        const result = await pool.query('DELETE FROM sections WHERE id=$1 AND user_id=$2 RETURNING *', [ id, userId ])
        if(result.rows.length === 0){
            return res.status(404).json({message: 'Section not found'})
        }
        res.json(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

// FOR TASKS

// create task
app.post('/createTask', verifyToken, async (req, res) => {

    try {
        const userId = req.user.id;
        const { section_id, task_name, completed, due_date, due_time } = req.body
        const result = await pool.query('INSERT INTO tasks (user_id, section_id, task_name, completed, due_date, due_time) VALUES ($1, $2, $3, $4, $5, $6) returning *', [
            userId, section_id, task_name, completed, due_date, due_time
        ])
        res.json(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

// get task section id
app.get('/getTask/:sectionId', verifyToken, async (req, res) => {

    try {
        const { sectionId } = req.params;
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT id, user_id, section_id, task_name, completed, due_date::text as due_date, due_time::text as due_time, created_at, updated_at FROM tasks WHERE section_id = $1 AND user_id=$2 ORDER BY id ASC', 
            [ sectionId, userId ]
        );
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});

// update/edit task by id
app.put('/updateTask/:id', verifyToken, async (req, res) => {

    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { task_name, due_date, due_time, completed } = req.body;

        const result = await pool.query('UPDATE tasks SET task_name = $1, due_date=$2, due_time=$3, completed=$4 WHERE id=$5 AND user_id=$6 RETURNING *', [
            task_name, due_date, due_time, completed, id, userId
        ])
        if(result.rows.length === 0){
            return res.status(404).json({message: 'Task not found'})
        }
        res.json(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

// delete task by id
app.delete('/deleteTask/:id', verifyToken, async (req, res) => {

    try {
        const { id } = req.params;
        const userId = req.user.id;
        const result = await pool.query('DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING *', [ id, userId ])
        if(result.rows.length === 0){
            return res.status(404).json({message: 'Task not found'})
        }
        res.json({message: 'Task removed', task_name: result.rows[0]})
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

// get task of user_id
app.get('/getTask', verifyToken, async (req, res) => {

    try {
        const userId = req.user.id;
        const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY id ASC ', [ userId ])
        return res.json(result.rows)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

// get section with completed(true) task
app.get('/getSectionsWithCompleted', verifyToken, async (req, res) => {

    try {
        const userId = req.user.id;
        const result = await pool.query('SELECT DISTINCT s.id, s.title, s.description FROM sections s INNER JOIN tasks t ON s.id = t.section_id WHERE s.user_id = $1 AND t.completed = true ORDER BY s.id ASC', [ userId ])
        res.json(result.rows)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

// get section with incomplete(false) task
app.get('/getSectionsWithIncomplete', verifyToken, async(req, res) => {

    try {
        const userId = req.user.id;
        const result = await pool.query('SELECT DISTINCT s.id, s.title, s.description FROM sections s INNER JOIN tasks t ON s.id = t.section_id WHERE s.user_id = $1 AND t.completed = false ORDER BY s.id ASC', [ userId ])
        res.json(result.rows)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Jem! your server is running on port ${PORT}`)
})