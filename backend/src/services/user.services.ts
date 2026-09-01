import pool from "../config/db.js";
// services contain the DB logic
// Talk to the database and perform
// find user
export const findUserByFirebaseUid = async (firebaseUid: string) => {
  const result = await pool.query(
    `
    SELECT
      user_id,
      firebase_uid,
      name,
      email,
      phone,
      role,
      created_at
    FROM users
    WHERE firebase_uid = $1
    `,
    [firebaseUid]
  );
  console.log("existing user found")
  return result.rows[0] || null;
};

// create user
export const createUser = async (
  firebaseUid: string,
  name: string,
  email: string
) => {
  const result = await pool.query(
    `
    INSERT INTO users (
      firebase_uid,
      name,
      email
    )
    VALUES ($1, $2, $3)
    RETURNING
      user_id,
      firebase_uid,
      name,
      email,
      phone,
      role,
      created_at
    `,
    [firebaseUid, name, email]
  );
  console.log("new user created")
  return result.rows[0];
};