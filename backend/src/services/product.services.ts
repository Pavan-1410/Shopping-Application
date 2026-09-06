import pool from "../config/db.js";
import { CreateProductInput, Product } from "../types/products.types.js";
import { findCategoryById } from "./category.service.js";

export const insertProduct = async (productdata: CreateProductInput): Promise<Product | undefined> => {

    const { category_id, name, description, price, stock, image_url } = productdata;

        const category = await findCategoryById(category_id);       // we are checking if user enter invalid category_is like 999

        if (!category) {
            return undefined;
        }
    const result = await pool.query(
        `
            INSERT INTO products (
            category_id,
            name,
            description,
            price,
            stock,
            image_url
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
        [
            category_id,
            name,
            description,
            price,
            stock,
            image_url,
        ]
    );

    return result.rows[0];

}

export const updateTheProduct = async (productId: number, productdata: CreateProductInput): Promise<Product | undefined> => {      // we use undefine if the product is not exists then result.rows = [] i.e. undefined

    const { category_id, name, description, price, stock, image_url } = productdata;
    const result = await pool.query(
        `
    UPDATE products
    SET
      category_id = $1,
      name = $2,
      description = $3,
      price = $4,
      stock = $5,
      image_url = $6,
      updated_at = NOW()
    WHERE product_id = $7
    RETURNING *
    `,
        [
            category_id,
            name,
            description,
            price,
            stock,
            image_url,
            productId,
        ]
    );

    return result.rows[0];

}

export const deleteTheProduct = async (productId: number): Promise<Product | undefined> => {
    const result = await pool.query(
        `
    DELETE FROM products
    WHERE product_id = $1
    RETURNING *
    `,
        [productId]
    );

    return result.rows[0];
};

export const getAllProductsService = async (): Promise<Product[]> => {
  const result = await pool.query(
    `
    SELECT *
    FROM products
    ORDER BY created_at DESC
    `
  );

  return result.rows;
};

export const getProductByIdService = async (
  productId: number
): Promise<Product | undefined> => {
  const result = await pool.query(
    `
    SELECT *
    FROM products
    WHERE product_id = $1
    `,
    [productId]
  );

  return result.rows[0];
};