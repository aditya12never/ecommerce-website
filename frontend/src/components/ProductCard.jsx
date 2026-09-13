import { Link } from "react-router-dom";
import {
  FiShoppingCart,
  FiStar,
} from "react-icons/fi";

import { useCart } from "../context/useCart";

function ProductCard({ product }) {

  const {
    addToCart,
  } = useCart();

  const stock = Number(product.stock ?? 0);

  const isOutOfStock =
    stock <= 0;

  const handleAddToCart = () => {

    if (isOutOfStock) {
      return;
    }

    addToCart(product);
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

      {/* PRODUCT IMAGE */}

      <Link
        to={`/products/${product.id}`}
        className="block"
      >

        <div className="relative aspect-square overflow-hidden bg-gray-100">

          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* OUT OF STOCK */}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-900">
                Out of Stock
              </span>
            </div>
          )}

          {/* DISCOUNT */}

          {!isOutOfStock &&
            product.discount > 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                {product.discount}% OFF
              </span>
            )}

        </div>

      </Link>


      {/* PRODUCT INFORMATION */}

      <div className="p-4">

        <Link
          to={`/products/${product.id}`}
        >

          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {product.category}
          </p>

          <h3 className="mt-1 line-clamp-2 min-h-[48px] text-base font-semibold text-gray-900 transition-colors group-hover:text-gray-600">
            {product.title}
          </h3>

        </Link>


        {/* RATING */}

        <div className="mt-3 flex items-center gap-1 text-sm">

          <FiStar
            size={15}
            className="fill-current text-yellow-500"
          />

          <span className="font-medium text-gray-700">
            {product.rating ?? 0}
          </span>

          <span className="text-gray-400">
            ({product.reviews ?? 0})
          </span>

        </div>


        {/* PRICE */}

        <div className="mt-3 flex items-center gap-2">

          <span className="text-xl font-bold text-gray-900">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>

          {product.originalPrice &&
            product.originalPrice >
              product.price && (
              <span className="text-sm text-gray-400 line-through">
                ₹
                {Number(
                  product.originalPrice
                ).toLocaleString("en-IN")}
              </span>
            )}

        </div>


        {/* STOCK */}

        <div className="mt-2">

          {isOutOfStock ? (

            <p className="text-sm font-medium text-red-600">
              Currently unavailable
            </p>

          ) : stock <= 5 ? (

            <p className="text-sm font-medium text-orange-600">
              Only {stock} left in stock
            </p>

          ) : (

            <p className="text-sm font-medium text-green-600">
              In Stock
            </p>

          )}

        </div>


        {/* ADD TO CART */}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
            isOutOfStock
              ? "cursor-not-allowed bg-gray-200 text-gray-500"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >

          <FiShoppingCart size={17} />

          {isOutOfStock
            ? "Out of Stock"
            : "Add to Cart"}

        </button>

      </div>

    </article>
  );
}

export default ProductCard;