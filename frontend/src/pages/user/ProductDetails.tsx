import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import Navbar from "../../components/user/Navbar";
import { getAllProducts } from "../../api/adminApi";
import useAuthStore from "../../store/authstore";
import { addToCart, getCart } from "../../api/cartApi";
import toast from "react-hot-toast";
import useCartStore from "../../store/cartStore";

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

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { setCart } = useCartStore();


  const {
    data: productResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getAllProducts(token as string),
  });


  const products: Product[] = productResponse?.products ?? [];

  const product = products.find(
    (item) => item.product_id === productId
  );

  const isOutOfStock = product ? product.stock <= 0 : false;

  const { mutate: addProductToCart, isPending } = useMutation({
    mutationFn: () =>
      addToCart(token as string, product!.product_id, 1),

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
  // Loading
  if (isLoading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-500">
            Loading product...
          </p>
        </div>
      </>
    );
  }

  // Error
  if (isError) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-red-500">
            Failed to load product.
          </p>
        </div>
      </>
    );
  }

  // Product not found
  if (!product) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Product not found
          </h2>

          <button
            onClick={() => navigate("/home")}
            className="mt-4 rounded-lg bg-blue-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
          >
            Back to Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="w-full px-6 py-8 sm:px-10 lg:px-16">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-700"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Product Details */}
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          {/* Product Image */}
          <div className="flex h-[420px] items-center justify-center overflow-hidden rounded-lg bg-gray-100 p-5">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <div className="text-sm text-gray-400">
                No Image Available
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="px-2 md:px-4">
            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Price */}
            <p className="mt-5 text-3xl font-bold text-blue-700">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

            {/* Divider */}
            <div className="my-7 border-t border-gray-200" />

            {/* Description */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Description
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                {product.description}
              </p>
            </div>

            {/* Add To Cart */}
            <button
              disabled={isOutOfStock ||  isPending}
                onClick={(e) => {
                e.stopPropagation();
                addProductToCart();
          }}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <ShoppingCart size={20} />

                {isOutOfStock
                ? "Out of Stock"
                : isPending
                    ? "Adding..."
                    : "Add to Cart"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductDetails;