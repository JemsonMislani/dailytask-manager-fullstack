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

const PORT = 3004;
app.listen(PORT, () => {
    console.log(`Jem! your server is running on port ${PORT}`)
})