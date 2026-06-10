const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

app.use(cors())
app.use(express.json())

const pool = new Pool({
    user: 'postgres',
    password: 'Im_Jem23*',
    host: 'localhost',
    database: 'dailytask_manager_fullstack',
    port: 5432
})

// FOR USERS

// create user account
app.post('/createAcc', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPw = await bcrypt.hash(password, 10)
        const result = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [
            email, hashedPw
        ])
        res.json(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

// create login, validate acc
app.post('/createLogin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email=$1', [ email ])
        if(result.rows.length === 0){
            return res.status(400).json({message: 'User not found'})
        }

        const user = result.rows[0]
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'})
        }

        const token = jwt.sign({id: user.id}, 'YOUR_JWT_SECRET', {expiresIn: '1h'})
        return res.json({
            token,
            user: {id: user.id, email: user.email}
        })
        res.json({
            token, 
            user: {id: user.id, email:user.email}})
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

// create section
app.post('/createSection', async (req, res) => {

    try {
        const { user_id, title, description } = req.body;
        const result = await pool.query('INSERT INTO sections (user_id, title, description) VALUES ($1, $2, $3) RETURNING *', [
            user_id, title, description
        ])
        res.json(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

// FOR SECTION

// get section
app.get('/getSection', async (req, res) => {
    try {
        const { user_id, title, description } = req.query;
        const result = await pool.query('SELECT * FROM sections ORDER BY id ASC')
        res.json(result.rows)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

// edit section 
app.put('/editSection/:id', async (req, res) => {

    try {
        const { id } = req.params;
        const { title, description } = req.body
        const result = await pool.query('UPDATE sections SET title=$1, description=$2 WHERE id=$3 RETURNING *', [
            title, description, id
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
app.delete('/deleteSection/:id', async(req, res) => {

    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM sections WHERE id=$1 RETURNING *', [ id ])
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
app.post('/createTask', async (req, res) => {

    try {
        const { user_id, section_id, task_name, completed, due_date, due_time } = req.body
        const result = await pool.query('INSERT INTO tasks (user_id, section_id, task_name, completed, due_date, due_time) VALUES ($1, $2, $3, $4, $5, $6) returning *', [
            user_id, section_id, task_name, completed, due_date, due_time
        ])
        res.json(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

const PORT = 3004;
app.listen(PORT, () => {
    console.log(`Jem! your server is running on port ${PORT}`)
})