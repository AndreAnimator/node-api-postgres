import 'dotenv/config'
const { Pool } = pg
import pg from 'pg'

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
})

console.log(pool.password)

const getUsers = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM cliente ORDER BY id ASC')
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}

const getUserById = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    const results = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}

const createUser = async (request, response) => {
  const { name, email } = request.body

  try {
    const results = await pool.query(
      'INSERT INTO cliente (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    )
    response.status(201).send(`User added with ID: ${results.rows[0].id}`)
  } catch (error) {
    throw error
  }
}

const updateUser = async (request, response) => {
  const id = parseInt(request.params.id, 10)
  const { name, email } = request.body

  try {
    await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [
      name,
      email,
      id,
    ])
    response.status(200).send(`User modified with ID: ${id}`)
  } catch (error) {
    throw error
  }
}

const deleteUser = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id])
    response.status(200).send(`User deleted with ID: ${id}`)
  } catch (error) {
    throw error
  }
}

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}