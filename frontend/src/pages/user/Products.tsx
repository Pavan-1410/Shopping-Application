import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../../components/user/ProductCard";
import { getAllCategories, getAllProducts } from "../../api/adminApi";
import useAuthStore from "../../store/authstore";

interface Category {
  id: number;
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


const Products = () => {
    const { token } = useAuthStore()

  const {data: productsData,isLoading: productsLoading, isError: productsError,} = useQuery({
    queryKey: ["products"],
    queryFn:() => getAllProducts(token as string),
  });

  const {data: categoriesData,isLoading: categoriesLoading,isError: categoriesError,} = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(token as string),
  });

  const products: Product[] = productsData?.products ?? [];
  const categories: Category[] = categoriesData?.categories ?? [];
  /*
   * Group products by category
   */
  const productsByCategory = useMemo(() => {
    return categories
      .map((category) => {
        const categoryProducts = products.filter(
          (product) => Number(product.category_id )=== category.id
        );

        return {
          ...category,
          products: categoryProducts,
        };
      })
      .filter((category) => category.products.length > 0);
  }, [categories, products]);

  /*
   * Loading
   */
  if (productsLoading || categoriesLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading products...
        </p>
      </div>
    );
  }

  /*
   * Error
   */
  if (productsError || categoriesError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-red-500">
          Failed to load products. Please try again.
        </p>
      </div>
    );
  }

  /*
   * No products
   */
  if (productsByCategory.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">
          No products available.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Explore our products by category
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {productsByCategory.map((category) => (
            <section key={category.id}>
              
              {/* Category Heading */}
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
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

      </div>
    </main>
  );
};

export default Products;