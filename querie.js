import 'dotenv/config'
const { Pool } = pg
import pg from 'pg'
import bcrypt from "bcrypt"

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
})

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
    console.log(id)
    console.log("Ta nan?")
    const results = await pool.query('SELECT * FROM cliente WHERE id = $1', [id])
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
    await pool.query('UPDATE cliente SET name = $1, email = $2 WHERE id = $3', [
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
    await pool.query('DELETE FROM cliente WHERE id = $1', [id])
    response.status(200).send(`User deleted with ID: ${id}`)
  } catch (error) {
    throw error
  }
}

const signup = async (req, res) => {
  console.log("cadastra aí")
  let { name, surname, email, password } = req.body;
  console.log(req.body);

  let errors = [];

  console.log({
    name,
    surname,
    email,
    password,
  });

  if (errors.length > 0) {
    
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    // Validation passed
    pool.query(
      `SELECT * FROM cliente
        WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results);

        if (results.rows.length > 0) {
          console.log("Email already registered")
        } else {
          pool.query(
            `INSERT INTO cliente (name, email, password, surname)
                VALUES ($1, $3, $4, $2)
                RETURNING id, password`,
            [name, surname, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              console.log("You are now registered. Please log in");
              req.flash("success_msg", "You are now registered. Please log in");
              res.status(201).send("You are now registered. Please log in");
              // console.log(res);
              //res.redirect("/login");
            }
          );
        }
      }
    );
  }
}

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  signup
}