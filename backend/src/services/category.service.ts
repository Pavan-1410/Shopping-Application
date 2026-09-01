import pool from "../config/db.js";

export const createCategory = async (name: string) => {
  const result = await pool.query(
    `
    INSERT INTO categories (name)
    VALUES ($1)
    RETURNING category_id, name;
    `,
    [name]
  );

  return result.rows[0];
};

export const findAllCategories = async()=>{
    const result = await pool.query(
        `
        SELECT * from categories;
        `
    )
    return result.rows;
}

export const findCategoryById = async(category_id : number )=>{
    const result = await pool.query(
        `
        SELECT * from categories
        WHERE category_id = $1
        `,
        [category_id]
    )
    return result.rows[0];
}