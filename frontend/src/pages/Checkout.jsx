import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FiArrowLeft,
  FiTruck,
  FiCreditCard,
  FiCheckCircle,
  FiShield,
} from "react-icons/fi";

import { useCart } from "../context/useCart";

function Checkout() {
  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const shipping = cartTotal >= 999 ? 0 : 99;
  const total = cartTotal + shipping;

  // HANDLE INPUT
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  // PLACE ORDER
  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Prepare order data for Spring Boot
      const orderData = {
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),

        email: formData.email,

        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,

        totalAmount: total,

        status: "PLACED",

        items: cartItems.map((item) => ({
          productId: item.id,
          productTitle: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      console.log("Sending order:", orderData);

      // Send order to Spring Boot
const token =
  localStorage.getItem("shopzoneToken");

if (!token) {
  alert(
    "Your login session has expired. Please login again."
  );

  setIsPlacingOrder(false);

  return;
}

const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/orders`,
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(orderData),
  }
);

      if (!response.ok) {
        throw new Error(
          `Failed to place order. Status: ${response.status}`
        );
      }

      const savedOrder = await response.json();

      console.log("Order saved successfully:", savedOrder);

      // Clear cart only after successful backend save
      clearCart();

      setOrderPlaced(true);

    } catch (error) {
      console.error("Order placement error:", error);

      alert(
        "Failed to place your order. Please make sure the backend server is running and try again."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // ORDER SUCCESS
  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">

          <div className="rounded-3xl border border-gray-200 bg-white p-6 text-center sm:p-10">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <FiCheckCircle
                size={52}
                className="text-green-600"
              />
            </div>

            <h1 className="mt-7 text-3xl font-bold text-gray-900 sm:text-4xl">
              Order Placed Successfully!
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              Thank you for shopping with ShopZone.
            </p>

            <div className="mt-8 border-t border-gray-200 pt-6">

              <div className="flex justify-between text-gray-600">
                <span>Order Total</span>

                <span className="font-bold text-gray-900">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="mt-4 flex justify-between text-gray-600">
                <span>Payment</span>

                <span className="font-bold text-gray-900">
                  Cash on Delivery
                </span>
              </div>

              <div className="mt-4 flex justify-between text-gray-600">
                <span>Status</span>

                <span className="font-bold text-green-600">
                  Order Placed
                </span>
              </div>

            </div>

            <Link
              to="/products"
              className="mt-8 block w-full rounded-xl bg-gray-900 py-3.5 font-semibold text-white transition hover:bg-gray-800"
            >
              Continue Shopping
            </Link>

          </div>

        </div>
      </main>
    );
  }

  // EMPTY CART
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-16">
        <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">

          <div className="rounded-3xl border border-gray-200 bg-white p-8 sm:p-12">

            <div className="text-7xl">
              🛒
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Your Cart is Empty
            </h1>

            <p className="mt-3 text-gray-500">
              Add some products before proceeding to checkout.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-block rounded-xl bg-gray-900 px-7 py-3 font-semibold text-white"
            >
              Continue Shopping
            </Link>

          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">

      <div className="shop-container">

        {/* HEADER */}
        <div className="mb-8">

          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-gray-500 transition hover:text-gray-900"
          >
            <FiArrowLeft />
            Back to Cart
          </Link>

          <h1 className="mt-5 text-4xl font-bold text-gray-900">
            Checkout
          </h1>

          <p className="mt-2 text-gray-500">
            Complete your information to place your order.
          </p>

        </div>

        <form onSubmit={handlePlaceOrder}>

          <div className="grid gap-8 lg:grid-cols-3">

            {/* LEFT SIDE */}
            <div className="space-y-6 lg:col-span-2">

              {/* CUSTOMER INFORMATION */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6">

                <h2 className="text-2xl font-bold text-gray-900">
                  Customer Information
                </h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">

                  {/* FIRST NAME */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      First Name
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      required
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                    />

                  </div>

                  {/* LAST NAME */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Last Name
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      required
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                    />

                  </div>

                  {/* EMAIL */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      required
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                    />

                  </div>

                  {/* PHONE */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                    />

                  </div>

                </div>

              </section>

              {/* SHIPPING ADDRESS */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6">

                <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                  <FiTruck />
                  Shipping Address
                </h2>

                <div className="mt-6">

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House number, street, area"
                    required
                    rows="4"
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                  />

                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-3">

                  {/* CITY */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      required
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                    />

                  </div>

                  {/* STATE */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      required
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                    />

                  </div>

                  {/* PINCODE */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Pincode"
                      required
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                    />

                  </div>

                </div>

              </section>

              {/* PAYMENT */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6">

                <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                  <FiCreditCard />
                  Payment Method
                </h2>

                <div className="mt-6">

                  <label className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-gray-900 p-5">

                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      defaultChecked
                    />

                    <div>

                      <p className="font-bold text-gray-900">
                        Cash on Delivery
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Pay when your order is delivered.
                      </p>

                    </div>

                  </label>

                </div>

              </section>

            </div>

            {/* RIGHT SIDE */}
            <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 lg:sticky lg:top-24">

              <h2 className="text-2xl font-bold text-gray-900">
                Order Summary
              </h2>

              {/* PRODUCTS */}
              <div className="mt-6 space-y-4">

                {cartItems.map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-4"
                  >

                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">

                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />

                    </div>

                    <div className="flex-1">

                      <h3 className="font-semibold text-gray-900">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                    </div>

                    <p className="font-bold text-gray-900">
                      ₹{(
                        item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </p>

                  </div>

                ))}

              </div>

              {/* TOTALS */}
              <div className="mt-6 space-y-4 border-t border-gray-200 pt-5">

                {/* SUBTOTAL */}
                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-semibold">
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>

                </div>

                {/* SHIPPING */}
                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span className="font-semibold">
                    {shipping === 0
                      ? "FREE"
                      : `₹${shipping}`}
                  </span>

                </div>

                {/* TOTAL */}
                <div className="flex justify-between border-t border-gray-200 pt-4">

                  <span className="text-lg font-bold">
                    Total
                  </span>

                  <span className="text-2xl font-bold">
                    ₹{total.toLocaleString("en-IN")}
                  </span>

                </div>

              </div>

              {/* PLACE ORDER */}
              <button
                type="submit"
                disabled={isPlacingOrder}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >

                <FiCreditCard />

                {isPlacingOrder
                  ? "Placing Order..."
                  : "Place Order"}

              </button>

              {/* SECURITY */}
              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-500">

                <FiShield />

                Secure checkout

              </div>

            </aside>

          </div>

        </form>

      </div>

    </main>
  );
}

export default Checkout;