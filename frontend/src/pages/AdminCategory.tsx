import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../store/authstore";
import {createCategory, getAllCategories, } from "../api/adminApi" 

const AdminCategory = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");

  // Get all categories
const { data, isLoading } = useQuery({
  queryKey: ["categories"],
  queryFn: () => getAllCategories(token as string),
});

const categories = data?.categories ?? [];
  // Create category
  const {mutateAsync: addCategory,isPending: isCreating 
   } = useMutation({ mutationFn: (categoryName: string) => createCategory(token as string,
        categoryName
),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      setShowCreateModal(false);
      setName("");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addCategory(name);
    } catch (err) {
      console.error("Failed to create category:", err);
    }
  };

  if (isLoading) {
    return      
    <div className="p-6">
        <p className="text-gray-600">Loading orders...</p>
      </div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Categories
          </h1>

          <p className="text-sm text-gray-500">
            Manage your product categories
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Create Category
        </button>
      </div>

      {/* Category Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                ID
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold">
                Name
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category: {
                    category_id: string;
                    name: string;
                }) => (
              <tr
                key={category.category_id}
                className="border-t"
              >
                <td className="px-6 py-4">
                  {category.category_id}
                </td>

                <td className="px-6 py-4">
                  {category.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Create Category
            </h2>

            <form onSubmit={handleSubmit}>
              <label className="mb-2 block text-sm font-medium">
                Category Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                required
                className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setName("");
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isCreating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategory;