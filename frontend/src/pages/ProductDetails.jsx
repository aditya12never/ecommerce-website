import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiHeart,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiStar,
  FiTruck,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";

import { useCart } from "../context/useCart";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    addToCart,
    cartItems,
  } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:8080/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        setProduct(data);
        setQuantity(1);
      } catch (err) {
        console.error(
          "Error fetching product:",
          err
        );

        setError(
          "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /*
   * Find how many units of this product
   * are already present in the cart.
   */
  const cartItem = cartItems.find(
    (item) =>
      item.id === product?.id
  );

  const cartQuantity =
    cartItem?.quantity ?? 0;

  const stock = Number(
    product?.stock ?? 0
  );

  /*
   * Maximum quantity that can be selected
   * on this page.
   *
   * Example:
   * Stock = 5
   * Already in cart = 2
   * Available to add = 3
   */
  const availableToAdd =
    Math.max(
      0,
      stock - cartQuantity
    );

  const increaseQuantity = () => {
    if (
      quantity <
      availableToAdd
    ) {
      setQuantity(
        (current) =>
          current + 1
      );
    }
  };

  const decreaseQuantity = () => {
    setQuantity(
      (current) =>
        Math.max(
          1,
          current - 1
        )
    );
  };

  const handleAddToCart = () => {
    if (!product || stock <= 0) {
      return;
    }

    if (availableToAdd <= 0) {
      alert(
        "You already have the maximum available quantity of this product in your cart."
      );

      return;
    }

    const quantityToAdd =
      Math.min(
        quantity,
        availableToAdd
      );

    for (
      let i = 0;
      i < quantityToAdd;
      i++
    ) {
      addToCart(product);
    }

    setQuantity(1);
  };

  if (loading) {
    return (
      <section className="shop-container py-16 sm:py-20">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

            <p className="mt-4 text-sm text-gray-500">
              Loading product...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="shop-container py-16 sm:py-20">
        <div className="mx-auto max-w-lg text-center">

          <h1 className="text-2xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="mt-3 text-gray-500">
            {error ||
              "The product you are looking for does not exist."}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <FiArrowLeft size={17} />
            Back to Products
          </Link>

        </div>
      </section>
    );
  }

  const cannotAddMore =
    stock <= 0 ||
    availableToAdd <= 0;

  return (
    <section className="shop-container py-8 sm:py-12 lg:py-16">

      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-gray-900"
      >
        <FiArrowLeft size={17} />
        Back
      </button>

      {/* Product */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">

        {/* Product Image */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">

          <div className="aspect-square w-full">
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-contain p-8 sm:p-12 lg:p-16"
            />
          </div>

          {/* Discount */}
          {product.discount > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white">
              {product.discount}% OFF
            </span>
          )}

          {/* Wishlist */}
          <button
            type="button"
            aria-label={`Add ${product.title} to wishlist`}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition hover:bg-gray-900 hover:text-white"
          >
            <FiHeart size={20} />
          </button>

        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-center">

          {/* Category */}
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            {product.category}
          </p>

          {/* Title */}
          <h1 className="mt-2 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="mt-4 flex flex-wrap items-center gap-2">

            <div className="flex items-center gap-1">
              <FiStar
                size={18}
                className="fill-gray-900 text-gray-900"
              />

              <span className="font-semibold text-gray-900">
                {product.rating}
              </span>
            </div>

            <span className="text-gray-300">
              |
            </span>

            <span className="text-sm text-gray-500">
              {product.reviews} reviews
            </span>

          </div>

          {/* Price */}
          <div className="mt-6 flex flex-wrap items-center gap-3">

            <span className="text-3xl font-bold text-gray-900">
              ₹
              {Number(
                product.price
              ).toLocaleString("en-IN")}
            </span>

            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                ₹
                {Number(
                  product.originalPrice
                ).toLocaleString("en-IN")}
              </span>
            )}

          </div>

          {/* Description */}
          <div className="mt-6 border-t border-gray-200 pt-6">

            <h2 className="text-lg font-bold text-gray-900">
              Description
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
              {product.description}
            </p>

          </div>

          {/* Stock */}
          <div className="mt-6">

            {stock > 0 ? (
              <>
                <p className="text-sm font-semibold text-green-600">
                  {stock}{" "}
                  {stock === 1
                    ? "item"
                    : "items"}{" "}
                  in stock
                </p>

                {cartQuantity > 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    {cartQuantity}{" "}
                    already in your cart
                  </p>
                )}

                {availableToAdd > 0 &&
                  availableToAdd <= 5 && (
                    <p className="mt-1 text-sm font-medium text-orange-600">
                      Only{" "}
                      {availableToAdd}{" "}
                      more{" "}
                      {availableToAdd === 1
                        ? "item"
                        : "items"}{" "}
                      available to add
                    </p>
                  )}
              </>
            ) : (
              <p className="text-sm font-semibold text-red-600">
                Out of stock
              </p>
            )}

          </div>

          {/* Quantity */}
          {stock > 0 &&
            availableToAdd > 0 && (
              <div className="mt-5">

                <p className="mb-2 text-sm font-semibold text-gray-900">
                  Quantity
                </p>

                <div className="flex h-12 w-fit items-center overflow-hidden rounded-xl border border-gray-300">

                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity <= 1
                    }
                    className="flex h-full w-12 items-center justify-center text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiMinus size={16} />
                  </button>

                  <span className="flex h-full min-w-12 items-center justify-center border-x border-gray-300 px-4 text-sm font-semibold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      quantity >=
                      availableToAdd
                    }
                    className="flex h-full w-12 items-center justify-center text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiPlus size={16} />
                  </button>

                </div>

              </div>
            )}

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={
                handleAddToCart
              }
              disabled={
                cannotAddMore
              }
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <FiShoppingCart size={18} />

              {stock <= 0
                ? "Out of Stock"
                : availableToAdd <= 0
                ? "Maximum in Cart"
                : "Add to Cart"}
            </button>

            <Link
              to="/cart"
              className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              View Cart
            </Link>

          </div>

          {/* Benefits */}
          <div className="mt-8 grid gap-4 border-t border-gray-200 pt-6 sm:grid-cols-3">

            <div className="flex items-start gap-3">
              <FiTruck
                size={20}
                className="mt-0.5 shrink-0 text-gray-700"
              />

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Fast Delivery
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Quick doorstep delivery
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiShield
                size={20}
                className="mt-0.5 shrink-0 text-gray-700"
              />

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Secure Payment
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Safe & secure checkout
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiRefreshCw
                size={20}
                className="mt-0.5 shrink-0 text-gray-700"
              />

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Easy Returns
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Simple return process
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ProductDetails;