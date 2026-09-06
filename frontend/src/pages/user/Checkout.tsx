import {
  MapPin,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import Navbar from "../../components/user/Navbar";
import useAuthStore from "../../store/authstore";
import useCartStore from "../../store/cartStore";

import { createOrder } from "../../api/orderApi";

import {
  createAddress,
  getAllAddresses,
  type Address,
  type CreateAddressData,
} from "../../api/addressApi";

const Checkout = () => {
  const navigate = useNavigate();

  const { token } = useAuthStore();
  const { items, clearCart } = useCartStore();

  const [selectedAddressId, setSelectedAddressId] =
    useState<string | null>(null);

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [formData, setFormData] =
    useState<CreateAddressData>({
      full_name: "",
      phone: "",
      address_line: "",
      city: "",
      state: "",
      pincode: "",
    });

  // =========================
  // Fetch Addresses
  // =========================

  const {
    data: addressResponse,
    isLoading: addressesLoading,
    isError: addressesError,
    refetch: refetchAddresses,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: () =>
      getAllAddresses(token as string),
    enabled: !!token,
  });

  const addresses: Address[] =
    addressResponse?.result ?? [];

  // =========================
  // Select first address
  // =========================

  useEffect(() => {
    if (
      addresses.length > 0 &&
      !selectedAddressId
    ) {
      setSelectedAddressId(
        addresses[0].address_id
      );
    }
  }, [addresses, selectedAddressId]);

  // =========================
  // Create Address
  // =========================

  const {
    mutate: addAddress,
    isPending: isAddingAddress,
  } = useMutation({
    mutationFn: () =>
      createAddress(
        token as string,
        formData
      ),

    onSuccess: async () => {
      toast.success("Address added successfully");

      setFormData({
        full_name: "",
        phone: "",
        address_line: "",
        city: "",
        state: "",
        pincode: "",
      });

      setShowAddressForm(false);

      const result = await refetchAddresses();

      const updatedAddresses: Address[] =
        result.data?.result ?? [];

      /*
       * Select the newly created address.
       * The backend returns address_id as a string.
       */
      if (updatedAddresses.length > 0) {
        const newestAddress =
          [...updatedAddresses].sort(
            (a, b) =>
              Number(b.address_id) -
              Number(a.address_id)
          )[0];

        setSelectedAddressId(
          newestAddress.address_id
        );
      }
    },

    onError: (error) => {
      console.error(
        "Failed to create address:",
        error
      );

      toast.error(
        "Failed to add address"
      );
    },
  });

  // =========================
  // Create Order
  // =========================

  const {
    mutate: placeOrder,
    isPending: isPlacingOrder,
  } = useMutation({
    mutationFn: () => {
      if (!selectedAddressId) {
        throw new Error(
          "Please select an address"
        );
      }

      return createOrder(
        token as string,
        Number(selectedAddressId)
      );
    },

    onSuccess: () => {
      toast.success(
        "Order placed successfully!"
      );

      clearCart();

      navigate("/orders");
    },

    onError: (error) => {
      console.error(
        "Failed to place order:",
        error
      );

      toast.error(
        "Failed to place order"
      );
    },
  });

  // =========================
  // Input Handler
  // =========================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Empty Cart
  // =========================

  if (items.length === 0) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] w-full items-center justify-center px-6">
          <div className="text-center">
            <ShoppingBag
              size={50}
              className="mx-auto text-gray-300"
            />

            <h1 className="mt-4 text-xl font-semibold text-gray-800">
              Your cart is empty
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Add some products before placing
              an order.
            </p>

            <button
              onClick={() => navigate("/home")}
              className="mt-6 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800"
            >
              Continue Shopping
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="w-full px-4 py-6 sm:px-8 sm:py-8 lg:px-16">
        <div className="mx-auto w-full max-w-6xl">

          {/* Header */}

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Place Order
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Select your delivery address and
              place your order.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">

            {/* ========================= */}
            {/* LEFT */}
            {/* ========================= */}

            <div className="space-y-6 lg:col-span-2">

              {/* ========================= */}
              {/* Delivery Address */}
              {/* ========================= */}

              <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">
                    <MapPin
                      size={20}
                      className="text-blue-700"
                    />

                    <h2 className="text-lg font-semibold text-gray-900">
                      Delivery Address
                    </h2>
                  </div>

                  {!showAddressForm && (
                    <button
                      onClick={() =>
                        setShowAddressForm(true)
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                    >
                      <Plus size={16} />
                      Add Address
                    </button>
                  )}

                </div>

                {/* ========================= */}
                {/* Address Loading */}
                {/* ========================= */}

                {addressesLoading && (
                  <div className="mt-5 rounded-lg bg-gray-50 p-5 text-center">
                    <p className="text-sm text-gray-500">
                      Loading addresses...
                    </p>
                  </div>
                )}

                {/* ========================= */}
                {/* Address Error */}
                {/* ========================= */}

                {addressesError && (
                  <div className="mt-5 rounded-lg bg-red-50 p-4">
                    <p className="text-sm text-red-600">
                      Failed to load addresses.
                    </p>
                  </div>
                )}

                {/* ========================= */}
                {/* Saved Addresses */}
                {/* ========================= */}

                {!addressesLoading &&
                  addresses.length === 0 &&
                  !showAddressForm && (
                    <div className="mt-5 rounded-lg border border-dashed border-gray-300 p-6 text-center">
                      <MapPin
                        size={32}
                        className="mx-auto text-gray-300"
                      />

                      <p className="mt-2 text-sm font-medium text-gray-700">
                        No saved addresses
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Add an address to continue.
                      </p>

                      <button
                        onClick={() =>
                          setShowAddressForm(true)
                        }
                        className="mt-4 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
                      >
                        Add New Address
                      </button>
                    </div>
                  )}

                {!showAddressForm &&
                  addresses.length > 0 && (
                    <div className="mt-5 space-y-3">

                      {addresses.map((address) => {
                        const isSelected =
                          selectedAddressId ===
                          address.address_id;

                        return (
                          <label
                            key={
                              address.address_id
                            }
                            className={`block cursor-pointer rounded-lg border p-4 transition ${
                              isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            <div className="flex gap-3">

                              <input
                                type="radio"
                                name="address"
                                value={
                                  address.address_id
                                }
                                checked={
                                  isSelected
                                }
                                onChange={() =>
                                  setSelectedAddressId(
                                    address.address_id
                                  )
                                }
                                className="mt-1 h-4 w-4 accent-blue-700"
                              />

                              <div className="min-w-0">
                                <p className="font-semibold text-gray-800">
                                  {address.full_name}
                                </p>

                                <p className="mt-1 text-sm text-gray-600">
                                  {address.address_line}
                                </p>

                                <p className="text-sm text-gray-600">
                                  {address.city},{" "}
                                  {address.state} -{" "}
                                  {address.pincode}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                  Phone:{" "}
                                  {address.phone}
                                </p>
                              </div>

                            </div>
                          </label>
                        );
                      })}

                    </div>
                  )}

                {/* ========================= */}
                {/* Add Address Form */}
                {/* ========================= */}

                {showAddressForm && (
                  <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-5">

                    <div className="mb-5 flex items-center justify-between">

                      <h3 className="font-semibold text-gray-800">
                        Add New Address
                      </h3>

                      <button
                        onClick={() =>
                          setShowAddressForm(false)
                        }
                        className="text-gray-400 transition hover:text-gray-700"
                      >
                        <X size={20} />
                      </button>

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      {/* Full Name */}

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Full Name
                        </label>

                        <input
                          name="full_name"
                          value={
                            formData.full_name
                          }
                          onChange={handleChange}
                          placeholder="Enter full name"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600"
                        />
                      </div>

                      {/* Phone */}

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Phone
                        </label>

                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                          maxLength={10}
                          inputMode="numeric"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600"
                        />
                      </div>

                      {/* Address */}

                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Address
                        </label>

                        <input
                          name="address_line"
                          value={
                            formData.address_line
                          }
                          onChange={handleChange}
                          placeholder="House no, street, area"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600"
                        />
                      </div>

                      {/* City */}

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          City
                        </label>

                        <input
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Enter city"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600"
                        />
                      </div>

                      {/* State */}

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          State
                        </label>

                        <input
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Enter state"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600"
                        />
                      </div>

                      {/* Pincode */}

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Pincode
                        </label>

                        <input
                          name="pincode"
                          value={
                            formData.pincode
                          }
                          onChange={handleChange}
                          placeholder="Enter pincode"
                          maxLength={6}
                          inputMode="numeric"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600"
                        />
                      </div>

                    </div>

                    <button
                      onClick={() => addAddress()}
                      disabled={isAddingAddress}
                      className="mt-5 w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                      {isAddingAddress
                        ? "Saving Address..."
                        : "Save Address"}
                    </button>

                  </div>
                )}

              </div>

              {/* ========================= */}
              {/* Order Items */}
              {/* ========================= */}

              <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">

                <div className="flex items-center gap-2">
                  <ShoppingBag
                    size={20}
                    className="text-blue-700"
                  />

                  <h2 className="text-lg font-semibold text-gray-900">
                    Order Items
                  </h2>
                </div>

                <div className="mt-5 space-y-3">

                  {items.map((item) => (
                    <div
                      key={item.cart_item_id}
                      className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Product #{item.product_id}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Quantity:{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <span className="text-sm font-medium text-gray-700">
                        × {item.quantity}
                      </span>
                    </div>
                  ))}

                </div>
              </div>

            </div>

            {/* ========================= */}
            {/* ORDER SUMMARY */}
            {/* ========================= */}

            <div className="h-fit rounded-xl border border-gray-200 bg-white p-5 sm:p-6">

              <h2 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="my-5 border-t border-gray-200" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Items
                </span>

                <span className="text-sm font-medium text-gray-800">
                  {items.reduce(
                    (sum, item) =>
                      sum + item.quantity,
                    0
                  )}
                </span>
              </div>

                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-600">
                    Your order will be placed using the selected
                    delivery address.
                </p>
                </div>

              <button
                onClick={() => placeOrder()}
                disabled={
                  isPlacingOrder ||
                  !selectedAddressId ||
                  addresses.length === 0
                }
                className="mt-6 w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isPlacingOrder
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

              <button
                onClick={() =>
                  navigate("/cart")
                }
                disabled={isPlacingOrder}
                className="mt-3 w-full rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Back to Cart
              </button>

            </div>

          </div>
        </div>
      </main>
    </>
  );
};

export default Checkout;