import { useEffect, useMemo, useState } from "react";

import {
  FiFilter,
  FiSearch,
  FiX,
  FiChevronDown,
  FiSliders,
} from "react-icons/fi";

import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";

function Products() {
  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load products from Spring Boot API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError(
          "Unable to load products. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Get unique categories from API products
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category)),
    ];

    return ["All", ...uniqueCategories];
  }, [products]);

  // Filter + search + sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();

      result = result.filter((product) => {
        return (
          product.title?.toLowerCase().includes(search) ||
          product.category?.toLowerCase().includes(search) ||
          product.description?.toLowerCase().includes(search)
        );
      });
    }

    // Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        result.sort(
          (a, b) => (b.rating || 0) - (a.rating || 0)
        );
        break;

      case "name":
        result.sort((a, b) =>
          (a.title || "").localeCompare(b.title || "")
        );
        break;

      default:
        break;
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortBy("default");
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-white text-gray-900">
        <div className="shop-container py-20">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

              <p className="mt-5 text-lg font-semibold text-gray-900">
                Loading products...
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Fetching products from ShopZone server
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-white text-gray-900">
        <div className="shop-container py-20">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="max-w-md text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <FiX size={28} className="text-red-500" />
              </div>

              <h1 className="mt-5 text-2xl font-bold">
                Unable to load products
              </h1>

              <p className="mt-2 text-gray-500">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Page Header */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="shop-container py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
            ShopZone Store
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Shop All Products
          </h1>

          <p className="mt-4 max-w-2xl text-gray-600">
            Discover our collection of quality products across fashion,
            electronics, shoes, home essentials and more.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="shop-container">

          {/* Mobile Filter Button */}
          <div className="mb-5 lg:hidden">
            <button
              type="button"
              onClick={() =>
                setMobileFiltersOpen(!mobileFiltersOpen)
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 font-semibold transition hover:bg-gray-50"
            >
              <FiSliders size={18} />

              {mobileFiltersOpen
                ? "Hide Filters"
                : "Show Filters"}
            </button>
          </div>

          {/* Mobile Filters */}
          {mobileFiltersOpen && (
            <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 lg:hidden">

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category
                </label>

                <select
                  value={selectedCategory}
                  onChange={(event) =>
                    setSelectedCategory(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-500"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold">
                  Sort By
                </label>

                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-500"
                >
                  <option value="default">
                    Recommended
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                  <option value="rating">
                    Highest Rated
                  </option>

                  <option value="name">
                    Name: A to Z
                  </option>
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">

                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-bold">
                    Filters
                  </h2>

                  {(searchTerm ||
                    selectedCategory !== "All" ||
                    sortBy !== "default") && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-sm text-gray-500 transition hover:text-gray-900"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Categories
                  </h3>

                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() =>
                          setSelectedCategory(category)
                        }
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition ${
                          selectedCategory === category
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <span>{category}</span>

                        {selectedCategory === category && (
                          <span>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="mt-8 border-t border-gray-200 pt-7">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Sort Products
                  </h3>

                  <div className="space-y-1">

                    <button
                      type="button"
                      onClick={() => setSortBy("default")}
                      className={`w-full rounded-lg px-3 py-2.5 text-left transition ${
                        sortBy === "default"
                          ? "bg-gray-100 font-semibold text-gray-900"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Recommended
                    </button>

                    <button
                      type="button"
                      onClick={() => setSortBy("price-low")}
                      className={`w-full rounded-lg px-3 py-2.5 text-left transition ${
                        sortBy === "price-low"
                          ? "bg-gray-100 font-semibold text-gray-900"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Price: Low to High
                    </button>

                    <button
                      type="button"
                      onClick={() => setSortBy("price-high")}
                      className={`w-full rounded-lg px-3 py-2.5 text-left transition ${
                        sortBy === "price-high"
                          ? "bg-gray-100 font-semibold text-gray-900"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Price: High to Low
                    </button>

                    <button
                      type="button"
                      onClick={() => setSortBy("rating")}
                      className={`w-full rounded-lg px-3 py-2.5 text-left transition ${
                        sortBy === "rating"
                          ? "bg-gray-100 font-semibold text-gray-900"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Highest Rated
                    </button>

                    <button
                      type="button"
                      onClick={() => setSortBy("name")}
                      className={`w-full rounded-lg px-3 py-2.5 text-left transition ${
                        sortBy === "name"
                          ? "bg-gray-100 font-semibold text-gray-900"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Name: A to Z
                    </button>

                  </div>
                </div>
              </div>
            </aside>

            {/* Products Area */}
            <div>

              {/* Search + Result Count */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="relative max-w-xl flex-1">
                  <FiSearch
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search products..."
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-11 outline-none transition focus:border-gray-500"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full transition hover:bg-gray-100"
                      aria-label="Clear search"
                    >
                      <FiX size={17} />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">

                  <p className="whitespace-nowrap text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">
                      {filteredProducts.length}
                    </span>{" "}
                    products
                  </p>

                  {/* Desktop Sort */}
                  <div className="relative hidden md:block">
                    <FiChevronDown
                      size={17}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    <select
                      value={sortBy}
                      onChange={(event) =>
                        setSortBy(event.target.value)
                      }
                      className="cursor-pointer appearance-none rounded-xl border border-gray-300 bg-white py-2.5 pl-4 pr-10 text-sm outline-none focus:border-gray-500"
                    >
                      <option value="default">
                        Recommended
                      </option>

                      <option value="price-low">
                        Price: Low to High
                      </option>

                      <option value="price-high">
                        Price: High to Low
                      </option>

                      <option value="rating">
                        Highest Rated
                      </option>

                      <option value="name">
                        Name: A to Z
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(searchTerm ||
                selectedCategory !== "All") && (
                <div className="mb-6 flex flex-wrap items-center gap-2">

                  <span className="text-sm text-gray-500">
                    Active:
                  </span>

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm transition hover:bg-gray-200"
                    >
                      Search: "{searchTerm}"
                      <FiX size={14} />
                    </button>
                  )}

                  {selectedCategory !== "All" && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCategory("All")
                      }
                      className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm transition hover:bg-gray-200"
                    >
                      {selectedCategory}
                      <FiX size={14} />
                    </button>
                  )}

                </div>
              )}

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">

                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}

                </div>
              ) : (
                /* Empty State */
                <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-gray-200 px-6">

                  <div className="max-w-md text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <FiSearch
                        size={25}
                        className="text-gray-500"
                      />
                    </div>

                    <h2 className="mt-5 text-2xl font-bold">
                      No products found
                    </h2>

                    <p className="mt-2 text-gray-500">
                      We couldn't find any products matching
                      your search or selected filters.
                    </p>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
                    >
                      <FiFilter size={17} />
                      Clear Filters
                    </button>

                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Products;