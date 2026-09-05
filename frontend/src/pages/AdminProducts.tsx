import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Package, X } from "lucide-react";
import { getAllProducts, createProduct, getAllCategories } from "../api/adminApi";
import useAuthStore from "../store/authstore";

const DotsLoader = () => (
  <span className="flex items-center gap-1">
    <span className="h-2 w-2 rounded-full bg-blue-700 animate-bounce [animation-delay:-0.3s]"></span>
    <span className="h-2 w-2 rounded-full bg-blue-700 animate-bounce [animation-delay:-0.15s]"></span>
    <span className="h-2 w-2 rounded-full bg-blue-700 animate-bounce"></span>
  </span>
);

interface Product {
  product_id: string;
  category_id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  image_url: string;
}

interface Category {          
  category_id: string;
  name: string;
}

const AdminProducts = () => {
  const authstore = useAuthStore();
  const token = authstore.token;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
// this make api call if the cache dont have data other wise use the same data
  const { data, isLoading } = useQuery({
    queryKey: ["products", token],
    queryFn: () => getAllProducts(token as string),
    enabled: !!token,
    staleTime: 1000 * 60,
  });

  const products: Product[] = data?.products ?? [];

  
  const { data: categoryData } = useQuery({   // useQuery is only for get and fetch
    queryKey: ["categories", token],
    queryFn: () => getAllCategories(token as string),
    enabled: !!token,
    staleTime: 1000 * 60,
  });

  const categories: Category[] = categoryData?.categories ?? [];
  

  //state to store forms
  const [form, setForm] = useState({
    category_id: "",
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { mutateAsync: addProduct, isPending: isAdding } = useMutation({    // we cant use usequery for post thats why we use usemutation
    mutationFn: (formData: FormData) => createProduct(token as string, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowAddModal(false);
      setForm({ category_id: "", name: "", description: "", price: "", stock: "" });
      setImageFile(null);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("category_id", form.category_id);
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      if (imageFile) formData.append("image", imageFile);

      await addProduct(formData);
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Products</h1>
          <p className="mt-1 text-gray-500">Manage your product catalog</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-800"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Product grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <DotsLoader />
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-md">
          <Package className="mx-auto mb-3 text-gray-300" size={48} />
          <p className="text-gray-500">No products yet. Add your first one.</p>
        </div>
      ) : (   // cards design
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.product_id}
              onClick={() => navigate(`/admin/products/${product.product_id}`)}
              className="cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
            >
                <div className="flex h-40 w-full items-center justify-center overflow-hidden bg-blue-50">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover object-center"

                />
                </div>
              <div className="p-4">
                <h3 className="truncate font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {product.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-700">
                    ₹{product.price}
                  </span>
                  <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-blue-700">Add Product</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Category
                </label>
                <select
                    required
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="" disabled>
                    Select a category
                    </option>
                    {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                        {cat.name}
                    </option>
                    ))}
                </select>
                </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isAdding}
                className="w-full rounded-lg bg-blue-700 py-2.5 font-medium text-white transition hover:bg-blue-800 disabled:opacity-60"
              >
                {isAdding ? "Adding..." : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;