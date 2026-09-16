import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiShoppingBag,
  FiSmartphone,
  FiHome,
  FiWatch,
} from "react-icons/fi";

import ProductCard from "../components/ProductCard";

function Home() {
  const categories = [
    {
      name: "Fashion",
      description: "Trendy styles for every day",
      icon: <FiShoppingBag />,
    },
    {
      name: "Electronics",
      description: "Smart devices & accessories",
      icon: <FiSmartphone />,
    },
    {
      name: "Shoes",
      description: "Comfort meets modern style",
      icon: <FiWatch />,
    },
    {
      name: "Home",
      description: "Make your space better",
      icon: <FiHome />,
    },
  ];

  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to load featured products:", error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <main className="bg-white text-gray-900">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="bg-gray-50">
        <div className="shop-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 sm:py-16 lg:py-20">

            {/* Hero Content */}
            <div className="order-2 lg:order-1 w-full max-w-2xl">

              <p className="text-sm sm:text-base font-semibold tracking-[0.18em] uppercase text-gray-500">
                New Collection 2026
              </p>

              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 leading-[1.05]">
                Everything You Need.
                <span className="block text-gray-500">
                  All in One Place.
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-gray-600 leading-7 max-w-xl">
                Discover quality products, modern styles, and everyday
                essentials at prices you'll love.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full">

                <Link
                  to="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition"
                >
                  Shop Now
                  <FiArrowRight size={18} />
                </Link>

                <Link
                  to="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-900 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition"
                >
                  Explore Categories
                </Link>

              </div>

              {/* Small Stats */}
              <div className="flex flex-wrap gap-6 sm:gap-10 mt-10 pt-8 border-t border-gray-200">

                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    10K+
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Happy Customers
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    500+
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Products
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    4.8★
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Customer Rating
                  </p>
                </div>

              </div>
            </div>

            {/* Hero Visual */}
            <div className="order-1 lg:order-2 w-full flex justify-center">

              <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl aspect-square mx-auto bg-gray-900 rounded-3xl overflow-hidden">

                {/* Decorative Shapes */}
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10" />

                <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-white/5" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-8 text-center">

                  <p className="text-sm tracking-[0.3em] uppercase text-gray-400">
                    Welcome to
                  </p>

                  <h2 className="mt-4 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                    ShopZone
                  </h2>

                  <p className="mt-5 text-gray-400 max-w-sm leading-6">
                    Your destination for fashion, electronics,
                    footwear, home essentials and more.
                  </p>

                  <Link
                    to="/products"
                    className="mt-8 inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
                  >
                    Discover More
                    <FiArrowRight size={18} />
                  </Link>

                </div>

                {/* Decorative Product Circles */}
                <div className="absolute top-8 left-8 w-12 h-12 rounded-full border border-white/20" />

                <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full border border-white/10" />

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          BENEFITS SECTION
      ====================================================== */}

      <section className="border-b border-gray-200 bg-white">
        <div className="shop-container">

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">

            {/* Free Delivery */}
            <div className="flex items-center gap-4 py-6 px-2 sm:px-5 lg:px-8">

              <div className="w-12 h-12 shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                <FiTruck size={21} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Free Delivery
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  On orders above ₹999
                </p>
              </div>

            </div>


            {/* Secure Payment */}
            <div className="flex items-center gap-4 py-6 px-2 sm:px-5 lg:px-8">

              <div className="w-12 h-12 shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                <FiShield size={21} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Secure Payment
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  100% secure checkout
                </p>
              </div>

            </div>


            {/* Easy Returns */}
            <div className="flex items-center gap-4 py-6 px-2 sm:px-5 lg:px-8">

              <div className="w-12 h-12 shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                <FiRefreshCw size={21} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Easy Returns
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Simple return process
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          CATEGORY SECTION
      ====================================================== */}

      <section className="py-16 sm:py-20">

        <div className="shop-container">

          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">

            <div>

              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                Browse
              </p>

              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
                Shop by Category
              </h2>

              <p className="mt-3 text-gray-500 max-w-xl">
                Explore our popular categories and find products
                made for your everyday needs.
              </p>

            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-gray-500 transition"
            >
              View All
              <FiArrowRight />
            </Link>

          </div>


          {/* Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">

            {categories.map((category) => (
              <Link
                key={category.name}
                to="/products"
                className="group bg-gray-50 rounded-2xl p-5 sm:p-6 min-h-[160px] sm:min-h-[180px] flex flex-col justify-between border border-gray-100 hover:border-gray-300 hover:bg-gray-100 transition"
              >

                <div className="flex items-center justify-between">

                  <div className="text-4xl text-gray-800">
                    {category.icon}
                  </div>

                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition">
                    <FiArrowRight size={17} />
                  </div>

                </div>


                <div className="mt-8">

                  <h3 className="text-xl font-bold text-gray-900">
                    {category.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    {category.description}
                  </p>

                </div>

              </Link>
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURED PRODUCTS
      ====================================================== */}

      <section className="py-16 sm:py-20 bg-gray-50">

        <div className="shop-container">

          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">

            <div>

              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                Our Selection
              </p>

              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
                Featured Products
              </h2>

              <p className="mt-3 text-gray-500">
                Handpicked products our customers love.
              </p>

            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-gray-500 transition"
            >
              View All Products
              <FiArrowRight />
            </Link>

          </div>


          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">

            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA SECTION
      ====================================================== */}

      <section className="py-16 sm:py-20 bg-white">

        <div className="shop-container">

          <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-6 py-12 sm:px-10 sm:py-16 lg:px-16">

            {/* Decorative Circles */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5" />

            <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-white/5" />


            <div className="relative max-w-3xl">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                ShopZone
              </p>

              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Find something you'll love.
              </h2>

              <p className="mt-5 text-gray-400 text-base sm:text-lg leading-7 max-w-2xl">
                Browse our latest collection and discover quality
                products at great prices.
              </p>

              <Link
                to="/products"
                className="mt-8 inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                Start Shopping
                <FiArrowRight size={18} />
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;