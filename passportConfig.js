import pl from "passport-local"
const LocalStrategy = pl.Strategy;
const { Pool } = pg
import pg from 'pg'
import bcrypt from "bcrypt";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
})

function initialize(passport) {
  console.log("Initialized");

  const authenticateUser = (email, password, done) => {
    console.log(email, password);
    pool.query(
      `SELECT * FROM cliente WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          const user = results.rows[0];
          console.log("tem muitos resultados");
          console.log(user);

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.log("deu um erro");
              console.log(err);
            }
            if (isMatch) {
              console.log("Deu match");
              console.log(user);
              return done(null, user);
            } else {
              console.log("Password is incorrect");
              return done(null, false, { message: "Password is incorrect" });
            }
          });
        } else {
          console.log("No user with that email address");
          return done(null, false, {
            message: "No user with that email address"
          });
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    console.log("Ta deserializando?")
    pool.query(`SELECT * FROM cliente WHERE id = $1`, [id], (err, results) => {
      if (err) {
        console.log("Deu erro no deserialize User");
        return done(err);
      }
      console.log(`ID is ${results.rows[0].id}`);
      return done(null, results.rows[0]);
    });
  });
}

export {
    initialize,
}