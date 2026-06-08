const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3004;
app.listen(PORT, () => {
    console.log(`Jem! your server is running on port ${PORT}`)
})