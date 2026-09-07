import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import Navbar from "../../components/user/Navbar";
import ProductCard from "../../components/user/ProductCard";

import {
  getAllCategories,
  getAllProducts,
} from "../../api/adminApi";

import useAuthStore from "../../store/authstore";

interface Category {
  category_id: string;
  name: string;
}

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

const Home = () => {
  const { token } = useAuthStore();

  // Get search value from URL
  const [searchParams] = useSearchParams();

  const searchQuery =
    searchParams.get("search")?.trim().toLowerCase() || "";

  // Get products
  const {
    data: productResponse,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getAllProducts(token as string),
  });

  // Get categories
  const {
    data: categoryResponse,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(token as string),
  });

  // Get actual arrays from API response
  const products: Product[] = productResponse?.products ?? [];
  const categories: Category[] = categoryResponse?.categories ?? [];

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchQuery) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery)
      );
    });
  }, [products, searchQuery]);

  // Group filtered products by category
  const productsByCategory = useMemo(() => {
    return categories
      .map((category) => {
        const categoryProducts = filteredProducts.filter(
          (product) =>
            product.category_id === category.category_id
        );

        return {
          ...category,
          products: categoryProducts,
        };
      })
      // Don't show categories with no matching products
      .filter((category) => category.products.length > 0);
  }, [categories, filteredProducts]);

  // Loading
  if (productsLoading || categoriesLoading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-500">
            Loading products...
          </p>
        </div>
      </>
    );
  }

  // Error
  if (productsError || categoriesError) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-red-500">
            Failed to load products.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : "Shop Products"}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? "Products matching your search"
              : "Explore products by category"}
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-10">
          {productsByCategory.map((category) => (
            <section key={category.category_id}>
              {/* Category heading */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {category.name}
                </h2>
              </div>

              {/* Products */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {category.products.map((product) => (
                  <ProductCard
                    key={product.product_id}
                    product={product}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* No products */}
        {productsByCategory.length === 0 && (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700">
                {searchQuery
                  ? `No products found for "${searchQuery}"`
                  : "No products available."}
              </p>

              {searchQuery && (
                <button
                  onClick={() => {
                    window.history.replaceState(
                      {},
                      "",
                      "/home"
                    );
                    window.location.reload();
                  }}
                  className="mt-4 rounded-lg bg-blue-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;