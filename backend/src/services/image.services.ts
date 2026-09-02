import supabase from "../config/supabase.js";
import type {} from "multer";

export const uploadProductImage = async (file: Express.Multer.File): Promise<string> => {

  const fileName = `${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from("Product-Image")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from("Product-Image")
    .getPublicUrl(fileName);

  return data.publicUrl;
};