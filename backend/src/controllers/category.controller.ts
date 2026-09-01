import { Request,Response } from "express"
import { createCategory, findAllCategories, findCategoryById,  } from "../services/category.service";
import { getAllProductsService, getProductByIdService } from "../services/product.services";
export const addCategory = async (req:Request,res:Response)=>{
  try {
        const {name} = req.body;
        if(!name){
          return res.status(400).json({
            message : "Category name is required",
          })
        }

        if (typeof name !== "string") {
          return res.status(400).json({
            message: "Category name must be a string",
          });
        }

        const category = await createCategory(name)

        return res.status(201).json({
          message : "Category created successfull",
          category
        })

  } catch (error) {
    console.log("error in category controller, addCategory",error)
    return res.status(500).json({
      message : "Internal Server Error",
    })
  }
}

export const getAllCategories = async(req:Request,res:Response)=>{
  try {
      const categories = await findAllCategories()
      return res.status(200).json({
        message:"Get all the categories",
        categories
      })
  } catch (error) {
    console.log("error in category controller,getAllCategories ",error)
    return res.status(500).json({
      message : "Internal Server Error",
    }) 
  }
}

export const getCategoryById = async(req:Request, res:Response)=>{
  try {
    const { categoryId } = req.params;
    if(!categoryId){
      return res.status(400).json({
        message:"category id is required"
      })
    }

    const categoryIdNumber = Number(categoryId);

    if (isNaN(categoryIdNumber)) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }


    const category = await findCategoryById(categoryIdNumber);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }


    return res.status(200).json({
      message:"Get the required categories",
     category
    })
    
  } catch (error) {
    console.log("error in category controller,getCategoryById",error)
    return res.status(500).json({
      message : "Internal Server Error",
    })
  }
}

