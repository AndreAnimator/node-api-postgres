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

const getIngredientes = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM ingredientes ORDER BY id ASC')
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}

const getIngredienteById = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    console.log(id)
    console.log("Ta nan?")
    const results = await pool.query('SELECT * FROM ingredientes WHERE id = $1', [id])
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}

const getIngredienteByType = async (request, response) => {
  const type = request.params.type;

  try {
    console.log(type)
    console.log("Ta nan?")
    const results = await pool.query('SELECT * FROM ingredientes WHERE type = $1', [type])
    console.log(results.rows)
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}

const createIngrediente = async (request, response) => {
  const { name, category, calories, type } = request.body

  try {
    const results = await pool.query(
      'INSERT INTO ingredientes (name, category, calories, type) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, category, calories, type]
    )
    response.status(201).send(`Ingredient added with ID: ${results.rows[0].id}`)
  } catch (error) {
    throw error
  }
}

const updateIngrediente = async (request, response) => {
  const id = parseInt(request.params.id, 10)
  const { name, category, calories, type } = request.body

  try {
    await pool.query('UPDATE ingredientes SET name = $1, category = $2, calories = $3, type = $4 WHERE id = $5', [
      name,
      category,
      calories,
      type,
      id,
    ])
    response.status(200).send(`Ingredient modified with ID: ${id}`)
  } catch (error) {
    throw error
  }
}

const deleteIngrediente = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    await pool.query('DELETE FROM ingredientes WHERE id = $1', [id])
    response.status(200).send(`Ingredient deleted with ID: ${id}`)
  } catch (error) {
    throw error
  }
}

const getLanches = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM lanches ORDER BY id ASC')
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}

const getLancheById = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    console.log(id)
    console.log("Ta nan?")
    const results = await pool.query('SELECT * FROM lanches WHERE id = $1', [id])
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}

const createLanche = async (request, response) => {
  const { name, calorias, cliente_id } = request.body

  try {
    const results = await pool.query(
      'INSERT INTO lanches (name, calorias, cliente_id) VALUES ($1, $2, $3) RETURNING *',
      [name, calorias, cliente_id]
    )
    response.status(201).send(`Lanche added with ID: ${results.rows[0].id}`)
  } catch (error) {
    throw error
  }
}

// CREATE INGREDIENTE LANCHE RELATIONSHIP
const createILRelationship = async (request, response) => {
  const { lanche_id, ingrediente_id } = request.body;

  try {
    const results = await pool.query(
      'INSERT INTO lanches_ingredientes (lanche_id, ingrediente_id) VALUES ($1, $2) RETURNING *',
      [lanche_id, ingrediente_id]
    )
    response.status(201).send(`Relationship added with ID: ${results.rows[0].id}`)
  } catch (error) {
    throw error
  }
}

const updateLanche = async (request, response) => {
  const id = parseInt(request.params.id, 10)
  const { name, ingredientes, calorias } = request.body

  try {
    await pool.query('UPDATE lanches SET name = $1, ingredientes = $2, calorias = $3 WHERE id = $4', [
      name,
      ingredientes,
      calorias,
      id,
    ])
    response.status(200).send(`Lanche modified with ID: ${id}`)
  } catch (error) {
    throw error
  }
}

const deleteLanche = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    await pool.query('DELETE FROM lanches WHERE id = $1', [id])
    response.status(200).send(`Lanche deleted with ID: ${id}`)
  } catch (error) {
    throw error
  }
}

/* acho eu que não precisa
const getHamburgers = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM cliente ORDER BY id ASC')
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}
*/

const getHamburgerIngredients = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    const results = await pool.query('SELECT ingredients FROM hamburger WHERE id = $1', [id])
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}

const getHamburgerIngredientsByCategory = async (request, response) => {
  /* Separa no front isso? não sei ainda */
}

const createHamburger = async (request, response) => {
  const { ingredientes } = request.body

  try {
    const results = await pool.query(
      'INSERT INTO hamburger (ingredientes) VALUES ($1) RETURNING *',
      [name]
    )
    response.status(201).send(`Hamburger added with ID: ${results.rows[0].id}`)
  } catch (error) {
    throw error
  }
}

const updateHamburger = async (request, response) => {
  const id = parseInt(request.params.id, 10)
  const { ingredientes } = request.body

  try {
    await pool.query('UPDATE hamburger SET ingredientes = $1 WHERE id = $2', [
      ingredientes,
      id,
    ])
    response.status(200).send(`Hamburger modified with ID: ${id}`)
  } catch (error) {
    throw error
  }
}

const deleteHamburger = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    await pool.query('DELETE FROM hamburger WHERE id = $1', [id])
    response.status(200).send(`Hamburger deleted with ID: ${id}`)
  } catch (error) {
    throw error
  }
}

const getHamburgerFavoritosByUser = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    await pool.query('SELECT hamburger_favoritos FROM cliete WHERE id = $1', [id])
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}

const updateHamburgerFavoritoByUser = async (request, response) => {
  const id = parseInt(request.params.id, 10)
  const { lanches } = request.body

  try {
    await pool.query('UPDATE cliente SET hamburger_favorites = $1 WHERE id = $2', [lanches, id])
    response.status(200).send(`Lanches atualizados with ID: ${id}`)
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
  signup,
  getIngredientes,
  getIngredienteById,
  getIngredienteByType,
  createIngrediente,
  updateIngrediente,
  deleteIngrediente,
  getLanches,
  getLancheById,
  createLanche,
  createILRelationship,
  updateLanche,
  deleteLanche,
  getHamburgerIngredients,
  createHamburger,
  updateHamburger,
  deleteHamburger,
  getHamburgerFavoritosByUser,
  updateHamburgerFavoritoByUser
}