import pool from "../config/db.js";
import { Address, CreateAddressInput } from "../types/address.types.js";

// Create Address
    export const createAddress = async (userId: number, addressData: CreateAddressInput): Promise<Address> => {
    const result = await pool.query(
        `
        INSERT INTO addresses (
        user_id,
        full_name,
        phone,
        address_line,
        city,
        state,
        pincode
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [
        userId,
        addressData.full_name,
        addressData.phone,
        addressData.address_line,
        addressData.city,
        addressData.state,
        addressData.pincode,
        ]
    );

    return result.rows[0];
    };


// Get All Addresses of User
export const getAddressesByUser = async (userId: number): Promise<Address[]> => {   // there is not the undefine because it has rows not rows[0] ot returns empty [] not undefine that we handel in controller 
  const result = await pool.query(
    `
    SELECT *
    FROM addresses
    WHERE user_id = $1
    ORDER BY address_id DESC
    `,
    [userId]
  );

  return result.rows;
};


// Get Address By ID to select specifi address
export const getAddressById = async (addressId: number, userId: number): Promise<Address | undefined> => {
  const result = await pool.query(
    `
    SELECT *
    FROM addresses
    WHERE address_id = $1
      AND user_id = $2
    `,
    [addressId, userId]
  );

  return result.rows[0];
};