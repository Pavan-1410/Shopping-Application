import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Trash2, Pencil, X } from "lucide-react";
import {
  getProductById,
  updateProduct,
  deleteProduct,
  getAllCategories,
} from "../api/adminApi";
import useAuthStore from "../store/authstore";

const DotsLoader = () => (
  <span className="flex items-center gap-1">
    <span className="h-2 w-2 rounded-full bg-blue-700 animate-bounce [animation-delay:-0.3s]"></span>
    <span className="h-2 w-2 rounded-full bg-blue-700 animate-bounce [animation-delay:-0.15s]"></span>
    <span className="h-2 w-2 rounded-full bg-blue-700 animate-bounce"></span>
  </span>
);

interface Category {
  category_id: string;
  name: string;
}

const AdminProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    category_id: "",
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["product", productId, token],
    queryFn: () => getProductById(token as string, productId as string),
    enabled: !!token && !!productId,
  });

  const { data: categoryData } = useQuery({
    queryKey: ["categories", token],
    queryFn: () => getAllCategories(token as string),
    enabled: !!token,
    staleTime: 1000 * 60,
  });

  const product = data?.product;
  const categories: Category[] = categoryData?.categories ?? [];

  // Look up category name for display
  const categoryName =
    categories.find((c) => c.category_id === product?.category_id)?.name ??
    "Unknown";

  const { mutateAsync: editProduct, isPending: isUpdating } = useMutation({
    mutationFn: (formData: FormData) =>
      updateProduct(token as string, productId as string, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsEditing(false);
    },
  });

  const { mutateAsync: removeProduct, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteProduct(token as string, productId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/admin/products");
    },
  });

  const openEdit = () => {
    if (!product) return;
    setForm({
      category_id: product.category_id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
    setIsEditing(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("category_id", form.category_id);
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      if (imageFile) formData.append("image", imageFile);

      await editProduct(formData);
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this product? This can't be undone.")) return;
    try {
      await removeProduct();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <DotsLoader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6 lg:p-10">
      <button
        onClick={() => navigate("/admin/products")}
        className="mb-6 flex items-center gap-2 text-blue-700 hover:underline"
      >
        <ArrowLeft size={18} />
        Back to Products
      </button>

      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <div className="flex h-64 w-full items-center justify-center overflow-hidden bg-blue-50 sm:h-80">
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-contain p-4"
          />
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
              <p className="mt-2 text-gray-500">{product.description}</p>

              {/* Category info */}
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Category: {categoryName}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                  ID: {product.category_id}
                </span>
              </div>
            </div>

            <span className="whitespace-nowrap rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
              Stock: {product.stock}
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold text-blue-700">₹{product.price}</p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={openEdit}
              className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 font-medium text-white transition hover:bg-blue-800"
            >
              <Pencil size={18} />
              Update
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60"
            >
              <Trash2 size={18} />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-blue-700">Update Product</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
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
                  Replace Image (optional)
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
                disabled={isUpdating}
                className="w-full rounded-lg bg-blue-700 py-2.5 font-medium text-white transition hover:bg-blue-800 disabled:opacity-60"
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductDetails;