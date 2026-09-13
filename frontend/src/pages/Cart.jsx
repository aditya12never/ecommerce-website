import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiTruck,
  FiShield,
} from "react-icons/fi";

import { useCart } from "../context/useCart";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  const deliveryCharge = cartTotal >= 999 || cartTotal === 0 ? 0 : 99;
  const finalTotal = cartTotal + deliveryCharge;

  if (cartItems.length === 0) {
    return (
      <main className="min-h-[70vh] bg-white text-gray-900">
        <section className="shop-container py-12 sm:py-16 lg:py-20">
          <div className="flex flex-col items-start justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
              <FiShoppingBag size={38} className="text-gray-500" />
            </div>

            <h1 className="mt-8 text-4xl sm:text-5xl lg:text-[4.25rem] font-black tracking-[-0.06em] leading-none text-gray-900">
              Your Cart is Empty
            </h1>

            <p className="mt-5 max-w-3xl text-base sm:text-lg text-gray-500 leading-8">
              Looks like you haven't added anything to your cart yet. Explore our
              products and find something you'll love.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-full text-base font-semibold shadow-sm hover:bg-gray-800 transition-transform duration-200 hover:-translate-y-0.5"
            >
              Start Shopping
              <FiArrowLeft size={18} />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white text-gray-900 min-h-screen">

      {/* Header */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="shop-container py-10 sm:py-14">

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
            ShopZone
          </p>

          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
            Shopping Cart
          </h1>

          <p className="mt-3 text-gray-500">
            {cartItems.length}{" "}
            {cartItems.length === 1 ? "item" : "items"} in your
            cart
          </p>

        </div>
      </section>

      {/* Cart Content */}
      <section className="py-10 sm:py-14 lg:py-16">
        <div className="shop-container">

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12">

            {/* Cart Items */}
            <div>

              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Cart Items
                </h2>

                <Link
                  to="/products"
                  className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
                >
                  <FiArrowLeft size={16} />
                  Continue Shopping
                </Link>
              </div>

              <div className="space-y-4">

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-2xl p-4 sm:p-5"
                  >

                    <div className="flex gap-4 sm:gap-5">

                      {/* Image */}
                      <Link
                        to={`/products/${item.id}`}
                        className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">

                            <p className="text-xs sm:text-sm uppercase tracking-wide text-gray-500">
                              {item.category}
                            </p>

                            <Link
                              to={`/products/${item.id}`}
                              className="mt-1 block text-base sm:text-lg font-bold text-gray-900 hover:text-gray-500 transition truncate"
                            >
                              {item.name}
                            </Link>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.id)
                            }
                            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-600 transition"
                            aria-label={`Remove ${item.name}`}
                          >
                            <FiTrash2 size={18} />
                          </button>

                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">

                          {/* Quantity */}
                          <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">

                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(item.id)
                              }
                              className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition"
                              aria-label="Decrease quantity"
                            >
                              <FiMinus size={15} />
                            </button>

                            <span className="w-9 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(item.id)
                              }
                              className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition"
                              aria-label="Increase quantity"
                            >
                              <FiPlus size={15} />
                            </button>

                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-lg sm:text-xl font-bold">
                              ₹
                              {(
                                item.price * item.quantity
                              ).toLocaleString("en-IN")}
                            </p>

                            {item.quantity > 1 && (
                              <p className="text-xs text-gray-500 mt-1">
                                ₹
                                {item.price.toLocaleString(
                                  "en-IN"
                                )} each
                              </p>
                            )}
                          </div>

                        </div>

                      </div>
                    </div>

                  </div>
                ))}

              </div>

              {/* Continue Shopping Mobile */}
              <Link
                to="/products"
                className="sm:hidden mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
              >
                <FiArrowLeft size={16} />
                Continue Shopping
              </Link>

              {/* Benefits */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="border border-gray-200 rounded-2xl p-5 flex gap-4">

                  <div className="w-11 h-11 shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                    <FiTruck size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Free Delivery
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Free shipping on orders above ₹999.
                    </p>
                  </div>

                </div>

                <div className="border border-gray-200 rounded-2xl p-5 flex gap-4">

                  <div className="w-11 h-11 shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                    <FiShield size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Secure Checkout
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Your payment information is protected.
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* Order Summary */}
            <aside>

              <div className="lg:sticky lg:top-24 border border-gray-200 rounded-2xl p-5 sm:p-6">

                <h2 className="text-xl font-bold">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4">

                  <div className="flex items-center justify-between text-gray-600">
                    <span>Subtotal</span>

                    <span className="font-medium text-gray-900">
                      ₹{cartTotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span>Delivery</span>

                    <span className="font-medium text-gray-900">
                      {deliveryCharge === 0
                        ? "FREE"
                        : `₹${deliveryCharge}`}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex items-center justify-between">

                    <span className="text-lg font-bold">
                      Total
                    </span>

                    <span className="text-2xl font-bold">
                      ₹{finalTotal.toLocaleString("en-IN")}
                    </span>

                  </div>

                </div>

                {cartTotal < 999 && (
                  <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                    Add ₹
                    {(999 - cartTotal).toLocaleString("en-IN")}{" "}
                    more to get <strong>FREE delivery</strong>.
                  </div>
                )}

                <Link
                  to="/checkout"
                  className="mt-6 w-full inline-flex items-center justify-center bg-gray-900 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/products"
                  className="mt-3 w-full inline-flex items-center justify-center border border-gray-300 text-gray-900 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </Link>

                <p className="mt-5 text-center text-xs text-gray-400">
                  Taxes and final shipping charges will be
                  calculated during checkout.
                </p>

              </div>

            </aside>

          </div>
        </div>
      </section>

    </main>
  );
}

export default Cart;
