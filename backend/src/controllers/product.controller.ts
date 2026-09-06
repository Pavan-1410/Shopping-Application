import { findCategoryById } from "../services/category.service.js";
import { uploadProductImage } from "../services/image.services.js";
import { deleteTheProduct, getAllProductsService, getProductByIdService, insertProduct, updateTheProduct } from "../services/product.services.js";
import { CreateProductInput } from "../types/products.types.js";
import { Request, Response } from "express";

export const createProduct = async (req:Request,res:Response)=>{
    try {
      const {
      category_id,
      name,
      description,
      price,
      stock,
      
    } = req.body;
    
    const categoryId = Number(category_id);
    const productPrice = Number(price);
    const productStock = stock !== undefined ? Number(stock) : 0;

    // Category validation
    if (category_id === undefined) {
      return res.status(400).json({
        message: "Category ID is required",
      });
    }

    if (Number.isNaN(categoryId)) {
      return res.status(400).json({
        message: "Category ID must be a number",
      });
    }

    // Name validation
    if (!name) {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    if (typeof name !== "string") {
      return res.status(400).json({
        message: "Product name must be a string",
      });
    }

    // Price validation
    if (price === undefined) {
      return res.status(400).json({
        message: "Product price is required",
      });
    }

    if (Number.isNaN(productPrice)) {
      return res.status(400).json({
        message: "Product price must be a number",
      });
    }

    // Stock validation
      if (stock !== undefined && Number.isNaN(productStock)) {
        return res.status(400).json({
          message: "Product stock must be a number",
        });
      }

    // handling image upload
    const file = req.file;

    let imageUrl: string | null = null;

    if (file) {
      imageUrl = await uploadProductImage(file);
    }


    // Create product input
    const productData: CreateProductInput = {       // here we are using our product object
      category_id : categoryId,
      name,
      description: description ?? null,
      price :productPrice ,
      stock: productStock ,
      image_url: imageUrl ,    // the imageUrl is comes from our uplaod service
    };

    const product = await insertProduct(productData)
    // Category does not exist
    if (!product) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });

    } catch (error) {
    console.log(
      "Error in product controller, createProduct",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
    }
}

export const updateProduct = async (req: Request,res: Response) => {
    try {
      const { productId } = req.params;
      const productIdNumber = Number(productId);

      // Product ID validation
      if (Number.isNaN(productIdNumber)) {
        return res.status(400).json({
          message: "Product ID must be a number",
        });
      }

      // Get existing product
      const existingProduct =
        await getProductByIdService(productIdNumber);

      if (!existingProduct) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      const {
        category_id,
        name,
        description,
        price,
        stock,
      } = req.body;

      // Convert multipart/form-data values
      const categoryId = Number(category_id);
      const productPrice = Number(price);
      const productStock =
        stock !== undefined ? Number(stock) : 0;

      // Category validation
      if (category_id === undefined) {
        return res.status(400).json({
          message: "Category ID is required",
        });
      }

      if (Number.isNaN(categoryId)) {
        return res.status(400).json({
          message: "Category ID must be a number",
        });
      }

      // Check category exists
      const existingCategory =
        await findCategoryById(categoryId);

      if (!existingCategory) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      // Name validation
      if (!name) {
        return res.status(400).json({
          message: "Product name is required",
        });
      }

      if (typeof name !== "string") {
        return res.status(400).json({
          message: "Product name must be a string",
        });
      }

      // Price validation
      if (price === undefined) {
        return res.status(400).json({
          message: "Product price is required",
        });
      }

      if (Number.isNaN(productPrice)) {
        return res.status(400).json({
          message: "Product price must be a number",
        });
      }

      // Stock validation
      if (Number.isNaN(productStock)) {
        return res.status(400).json({
          message: "Product stock must be a number",
        });
      }

      // Image handling
      const file = req.file;

      let imageUrl: string | null =
        existingProduct.image_url;

      // If new image is uploaded
      if (file) {
        imageUrl = await uploadProductImage(file);
      }

      // Product data
      const productData: CreateProductInput = {
        category_id: categoryId,
        name,
        description: description ?? null,
        price: productPrice,
        stock: productStock,
        image_url: imageUrl,
      };

      const product = await updateTheProduct(
        productIdNumber,
        productData
      );

      return res.status(200).json({
        message: "Product updated successfully",
        product,
      });

    } catch (error) {
      console.log(
        "Error in product controller, updateProduct",
        error
      );

      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
};

export const deleteProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const { productId } = req.params;

    const productIdNumber = Number(productId);

    // Product ID validation
    if (isNaN(productIdNumber)) {
      return res.status(400).json({
        message: "Product ID must be a number",
      });
    }

    const product = await deleteTheProduct(productIdNumber);

    // Product doesn't exist
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      product,
    });

  } catch (error) {
    console.log(
      "Error in product controller, deleteProduct",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export const getAllProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await getAllProductsService();

    return res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.log(
      "Error in product controller, getAllProducts",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
) => {
  try {
    const { productId } = req.params;

    const productIdNumber = Number(productId);

    if (isNaN(productIdNumber)) {
      return res.status(400).json({
        message: "Product ID must be a number",
      });
    }

    const product = await getProductByIdService(
      productIdNumber
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.log(
      "Error in product controller, getProductById",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
