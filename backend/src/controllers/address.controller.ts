import { Request,Response } from "express";
import { CreateAddressInput } from "../types/address.types.js";
import { createAddress, getAddressById, getAddressesByUser } from "../services/address.services.js";

export const createAddressController = async (req:Request,res:Response)=> {
    try {
        const userId = req.appUser?.user_id;

        if(!userId){
            return res.status(400).json({
                message : "Application user not found"
            })
        }

        const {full_name, phone, address_line, city, state, pincode} = req.body
            // Full name validation
            if (!full_name) {
            return res.status(400).json({
                message: "Full name is required",
            });
            }

            if (typeof full_name !== "string") {
            return res.status(400).json({
                message: "Full name must be a string",
            });
            }

            // Phone validation
            if (!phone) {
            return res.status(400).json({
                message: "Phone is required",
            });
            }

            if (typeof phone !== "string") {
            return res.status(400).json({
                message: "Phone must be a string",
            });
            }

            // Address validation
            if (!address_line) {
            return res.status(400).json({
                message: "Address is required",
            });
            }

            if (typeof address_line !== "string") {
            return res.status(400).json({
                message: "Address must be a string",
            });
            }

            // City validation
            if (!city) {
            return res.status(400).json({
                message: "City is required",
            });
            }

            if (typeof city !== "string") {
            return res.status(400).json({
                message: "City must be a string",
            });
            }

            // State validation
            if (!state) {
            return res.status(400).json({
                message: "State is required",
            });
            }

            if (typeof state !== "string") {
            return res.status(400).json({
                message: "State must be a string",
            });
            }

            // Pincode validation
            if (!pincode) {
            return res.status(400).json({
                message: "Pincode is required",
            });
            }

            if (typeof pincode !== "string") {
            return res.status(400).json({
                message: "Pincode must be a string",
            });
            }

            const addressData : CreateAddressInput = {
                full_name: full_name,
                phone: phone,
                address_line: address_line,
                city: city,
                state: state,
                pincode: pincode,
            }

            const result = await createAddress(userId,addressData)


            return res.status(201).json({
                message: "Address created successfully",
                result,
        });

    } catch (error) {
        return res.status(500).json({
        message: "Internal Server Error",
        });

    }
    
}

export const getAllAddressController = async (req:Request,res:Response)=>{
    try {
        const userId = req.appUser?.user_id;
        if (!userId){
            return res.status(400).json({
                message : "Application user not found"
            })
        }
        const result = await getAddressesByUser(userId)

        return res.status(200).json({
        message: "Addresses fetched successfully",
        result,
        });
    } catch (error) {
        return res.status(500).json({
        message: "Internal Server Error",
        });
    }
}

export const getAddressByIdController = async (req: Request, res: Response) => {
  try {
    const userId = req.appUser?.user_id;

    if (!userId) {
      return res.status(401).json({
        message: "Application user not found",
      });
    }

    const addressId = Number(req.params.addressId);

    if (Number.isNaN(addressId)) {
      return res.status(400).json({
        message: "Invalid address ID",
      });
    }

    const address = await getAddressById(addressId, userId);

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    return res.status(200).json({
      message: "Address fetched successfully",
      address,
    });
  } catch (error) {

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};