import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { addToCart, getCart } from "../../api/cartApi";
import useAuthStore from "../../store/authstore";
import useCartStore from "../../store/cartStore";
import toast from "react-hot-toast";
interface Product {
  product_id: string;
  category_id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  const { token } = useAuthStore();
  const { setCart } = useCartStore();

  const isOutOfStock = product.stock <= 0;

  const { mutate: addProductToCart, isPending } = useMutation({
    mutationFn: () =>
      addToCart(token as string, product.product_id, 1),

    onSuccess: async () => {
      try {
        toast.success("Product added to cart!");
        const cartData = await getCart(token as string);
        setCart(cartData.cart, cartData.items);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    },

    onError: (error) => {
      console.error("Failed to add product to cart:", error);
    },
  });

  const handleCardClick = () => {
    navigate(`/product/${product.product_id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      {/* Product Image */}
      <div className="h-52 w-full overflow-hidden bg-gray-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4">
        <h3 className="truncate text-base font-semibold text-gray-800">
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
            {product.description}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-blue-700">
            ₹{product.price}
          </span>

          {isOutOfStock ? (
            <span className="text-xs font-medium text-red-500">
              Out of stock
            </span>
          ) : (
            <span className="text-xs text-gray-500"></span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          disabled={isOutOfStock || isPending}
          onClick={(e) => {
            e.stopPropagation();
            
            addProductToCart();
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <ShoppingCart size={17} />

          {isOutOfStock
            ? "Out of Stock"
            : isPending
              ? "Adding..."
              : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;