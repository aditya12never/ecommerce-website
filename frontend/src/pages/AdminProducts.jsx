import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiArrowLeft,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiPackage,
  FiX,
} from "react-icons/fi";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [stockDrafts, setStockDrafts] = useState({});
  const [savingStockId, setSavingStockId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    originalPrice: "",
    discount: "",
    rating: "4.8",
    reviews: "0",
    stock: "",
    image: "",
  });


  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  const loadProducts = async () => {
    try {
      setError("");

      const data = await getProducts();

      setProducts(data);

      setStockDrafts(
        data.reduce((drafts, product) => {
          drafts[product.id] = Number(product.stock ?? 0);
          return drafts;
        }, {})
      );

      return data;
    } catch (error) {
      console.error(
        "Admin products error:",
        error
      );

      setError(
        error.message ||
          "Unable to load products."
      );

      throw error;
    }
  };


  // ==========================================
  // INITIAL PRODUCT LOAD
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const loadInitialProducts = async () => {
      try {
        setIsLoading(true);

        setError("");

        const data = await getProducts();

        if (!cancelled) {
          setProducts(data);

          setStockDrafts(
            data.reduce((drafts, product) => {
              drafts[product.id] = Number(
                product.stock ?? 0
              );
              return drafts;
            }, {})
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Admin products error:",
            error
          );

          setError(
            error.message ||
              "Unable to load products."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadInitialProducts();

    return () => {
      cancelled = true;
    };
  }, []);


  // ==========================================
  // FORM INPUT
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };


  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      price: "",
      originalPrice: "",
      discount: "",
      rating: "4.8",
      reviews: "0",
      stock: "",
      image: "",
    });

    setEditingId(null);

    setShowForm(false);
  };


  // ==========================================
  // OPEN ADD PRODUCT FORM
  // ==========================================

  const handleAddProduct = () => {
    setSuccess("");

    setError("");

    setFormData({
      title: "",
      category: "",
      price: "",
      originalPrice: "",
      discount: "",
      rating: "4.8",
      reviews: "0",
      stock: "",
      image: "",
    });

    setEditingId(null);

    setShowForm(true);
  };


  // ==========================================
  // OPEN EDIT PRODUCT FORM
  // ==========================================

  const handleEditProduct = (product) => {
    setSuccess("");

    setError("");

    setEditingId(product.id);

    setFormData({
      title: product.title ?? "",
      category: product.category ?? "",
      price: product.price ?? "",
      originalPrice:
        product.originalPrice ?? "",
      discount:
        product.discount ?? "",
      rating:
        product.rating ?? "4.8",
      reviews:
        product.reviews ?? "0",
      stock:
        product.stock ?? "",
      image:
        product.image ?? "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // ==========================================
  // SUBMIT PRODUCT FORM
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    setSuccess("");

    // Required field validation
    if (
      !formData.title.trim() ||
      !formData.category.trim() ||
      formData.price === "" ||
      formData.stock === "" ||
      !formData.image.trim()
    ) {
      setError(
        "Please fill in all required fields."
      );

      return;
    }


    // Product object sent to backend
    const productData = {
      title: formData.title.trim(),

      category:
        formData.category.trim(),

      price:
        Number(formData.price),

      originalPrice:
        formData.originalPrice === ""
          ? null
          : Number(
              formData.originalPrice
            ),

      discount:
        formData.discount === ""
          ? 0
          : Number(
              formData.discount
            ),

      rating:
        formData.rating === ""
          ? 4.8
          : Number(
              formData.rating
            ),

      reviews:
        formData.reviews === ""
          ? 0
          : Number(
              formData.reviews
            ),

      stock:
        Number(formData.stock),

      image:
        formData.image.trim(),
    };


    try {
      setIsSaving(true);

      // UPDATE
      if (editingId !== null) {
        await updateProduct(
          editingId,
          productData
        );

        setSuccess(
          "Product updated successfully."
        );
      }

      // CREATE
      else {
        await createProduct(
          productData
        );

        setSuccess(
          "Product added successfully."
        );
      }

      resetForm();

      await loadProducts();
    } catch (error) {
      console.error(
        "Product save error:",
        error
      );

      setError(
        error.message ||
          "Unable to save product."
      );
    } finally {
      setIsSaving(false);
    }
  };


  // ==========================================
  // STOCK MANAGEMENT
  // ==========================================

  const handleStockChange = (
    productId,
    value
  ) => {
    const numericValue = Number(value);

    setStockDrafts((current) => ({
      ...current,
      [productId]:
        Number.isFinite(numericValue) &&
        numericValue >= 0
          ? Math.floor(numericValue)
          : 0,
    }));
  };

  const changeStock = (
    productId,
    amount
  ) => {
    setStockDrafts((current) => {
      const currentStock =
        Number(current[productId] ?? 0);

      return {
        ...current,
        [productId]: Math.max(
          0,
          currentStock + amount
        ),
      };
    });
  };

  const saveStock = async (product) => {
    const stock = Math.max(
      0,
      Math.floor(
        Number(
          stockDrafts[product.id] ??
            product.stock ??
            0
        )
      )
    );

    try {
      setError("");
      setSuccess("");
      setSavingStockId(product.id);

      await updateProduct(
        product.id,
        {
          ...product,
          stock,
        }
      );

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === product.id
            ? {
                ...item,
                stock,
              }
            : item
        )
      );

      setStockDrafts((current) => ({
        ...current,
        [product.id]: stock,
      }));

      setSuccess(
        `"${product.title}" stock updated to ${stock}.`
      );
    } catch (error) {
      console.error(
        "Stock update error:",
        error
      );

      setError(
        error.message ||
          "Unable to update stock."
      );

      setStockDrafts((current) => ({
        ...current,
        [product.id]: Number(
          product.stock ?? 0
        ),
      }));
    } finally {
      setSavingStockId(null);
    }
  };


  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDeleteProduct = async (
    product
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${product.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      setSuccess("");

      await deleteProduct(
        product.id
      );

      setProducts((current) =>
        current.filter(
          (item) =>
            item.id !== product.id
        )
      );

      setSuccess(
        "Product deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      setError(
        error.message ||
          "Unable to delete product."
      );
    }
  };


  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ========================================
          HEADER
      ======================================== */}

      <section className="border-b border-gray-200 bg-white">

        <div className="shop-container">

          <div className="py-8 sm:py-10">

            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-gray-900"
            >
              <FiArrowLeft size={17} />

              Back to Dashboard
            </Link>


            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white">

                  <FiPackage size={23} />

                </div>


                <div>

                  <h1 className="text-3xl font-bold text-gray-900">

                    Manage Products

                  </h1>


                  <p className="mt-1 text-sm text-gray-500">

                    Add, edit, and remove ShopZone products.

                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={handleAddProduct}
                className="shop-btn shop-btn-primary"
              >

                <FiPlus size={18} />

                Add Product

              </button>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          CONTENT
      ======================================== */}

      <section className="shop-section shop-section-md">

        <div className="shop-container">


          {/* ====================================
              SUCCESS MESSAGE
          ==================================== */}

          {success && (

            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">

              {success}

            </div>

          )}


          {/* ====================================
              ERROR MESSAGE
          ==================================== */}

          {error && (

            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">

              {error}

            </div>

          )}


          {/* ====================================
              PRODUCT FORM
          ==================================== */}

          {showForm && (

            <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h2 className="text-xl font-bold text-gray-900">

                    {editingId !== null
                      ? "Edit Product"
                      : "Add Product"}

                  </h2>


                  <p className="mt-1 text-sm text-gray-500">

                    Enter the product information below.

                  </p>

                </div>


                <button
                  type="button"
                  onClick={resetForm}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                  aria-label="Close product form"
                >

                  <FiX size={18} />

                </button>

              </div>


              <form
                onSubmit={handleSubmit}
                className="mt-6"
              >

                <div className="grid gap-5 sm:grid-cols-2">


                  {/* TITLE */}

                  <div className="sm:col-span-2">

                    <label
                      htmlFor="title"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Product Title *
                    </label>

                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      className="shop-input"
                      placeholder="Enter product title"
                    />

                  </div>


                  {/* CATEGORY */}

                  <div>

                    <label
                      htmlFor="category"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Category *
                    </label>

                    <input
                      id="category"
                      name="category"
                      type="text"
                      value={formData.category}
                      onChange={handleChange}
                      className="shop-input"
                      placeholder="Electronics"
                    />

                  </div>


                  {/* PRICE */}

                  <div>

                    <label
                      htmlFor="price"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Price *
                    </label>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="shop-input"
                      placeholder="999"
                    />

                  </div>


                  {/* ORIGINAL PRICE */}

                  <div>

                    <label
                      htmlFor="originalPrice"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Original Price
                    </label>

                    <input
                      id="originalPrice"
                      name="originalPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        formData.originalPrice
                      }
                      onChange={handleChange}
                      className="shop-input"
                      placeholder="1299"
                    />

                  </div>


                  {/* DISCOUNT */}

                  <div>

                    <label
                      htmlFor="discount"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Discount (%)
                    </label>

                    <input
                      id="discount"
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={handleChange}
                      className="shop-input"
                      placeholder="20"
                    />

                  </div>


                  {/* RATING */}

                  <div>

                    <label
                      htmlFor="rating"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Rating
                    </label>

                    <input
                      id="rating"
                      name="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={handleChange}
                      className="shop-input"
                      placeholder="4.8"
                    />

                  </div>


                  {/* REVIEWS */}

                  <div>

                    <label
                      htmlFor="reviews"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Reviews
                    </label>

                    <input
                      id="reviews"
                      name="reviews"
                      type="number"
                      min="0"
                      value={formData.reviews}
                      onChange={handleChange}
                      className="shop-input"
                      placeholder="0"
                    />

                  </div>


                  {/* STOCK */}

                  <div>

                    <label
                      htmlFor="stock"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Stock *
                    </label>

                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleChange}
                      className="shop-input"
                      placeholder="50"
                    />

                  </div>


                  {/* IMAGE */}

                  <div className="sm:col-span-2">

                    <label
                      htmlFor="image"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Image URL *
                    </label>

                    <input
                      id="image"
                      name="image"
                      type="url"
                      value={formData.image}
                      onChange={handleChange}
                      className="shop-input"
                      placeholder="https://example.com/product.jpg"
                    />

                  </div>

                </div>


                {/* FORM BUTTONS */}

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={resetForm}
                    className="shop-btn shop-btn-secondary"
                  >

                    Cancel

                  </button>


                  <button
                    type="submit"
                    disabled={isSaving}
                    className="shop-btn shop-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {isSaving
                      ? "Saving..."
                      : editingId !== null
                        ? "Update Product"
                        : "Add Product"}

                  </button>

                </div>

              </form>

            </div>

          )}


          {/* ====================================
              LOADING
          ==================================== */}

          {isLoading && (

            <div className="flex min-h-[300px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

                <p className="mt-4 text-sm text-gray-500">

                  Loading products...

                </p>

              </div>

            </div>

          )}


          {/* ====================================
              EMPTY
          ==================================== */}

          {!isLoading &&
            !error &&
            products.length === 0 && (

              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">

                <FiPackage
                  size={40}
                  className="mx-auto text-gray-400"
                />

                <h2 className="mt-4 text-xl font-bold text-gray-900">

                  No Products

                </h2>

                <p className="mt-2 text-sm text-gray-500">

                  Add your first product to ShopZone.

                </p>

              </div>

            )}


          {/* ====================================
              PRODUCT LIST
          ==================================== */}

          {!isLoading &&
            products.length > 0 && (

              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">


                {/* LIST HEADER */}

                <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">

                  <h2 className="font-bold text-gray-900">

                    All Products

                  </h2>

                  <p className="mt-1 text-xs text-gray-500">

                    {products.length} product
                    {products.length === 1
                      ? ""
                      : "s"}

                  </p>

                </div>


                {/* PRODUCT ITEMS */}

                <div className="divide-y divide-gray-200">

                  {products.map((product) => (

                    <div
                      key={product.id}
                      className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center"
                    >


                      {/* IMAGE */}

                      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">

                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-contain p-2"
                        />

                      </div>


                      {/* PRODUCT INFORMATION */}

                      <div className="min-w-0 flex-1">

                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">

                          {product.category}

                        </p>


                        <h3 className="mt-1 text-base font-bold text-gray-900">

                          {product.title}

                        </h3>


                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">

                          <span className="font-bold text-gray-900">

                            ₹
                            {Number(
                              product.price
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </span>


                          <span
                            className={`font-semibold ${
                              Number(product.stock ?? 0) <= 0
                                ? "text-red-600"
                                : Number(product.stock ?? 0) <= 5
                                  ? "text-orange-600"
                                  : "text-green-600"
                            }`}
                          >
                            {Number(product.stock ?? 0) <= 0
                              ? "Out of Stock"
                              : `${product.stock} in stock`}
                          </span>


                          <span className="text-gray-500">

                            Rating: {product.rating}

                          </span>

                        </div>

                      </div>


                      {/* STOCK MANAGEMENT */}

                      <div className="w-full shrink-0 sm:w-auto">

                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Inventory
                        </p>

                        <div className="flex flex-wrap items-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              changeStock(
                                product.id,
                                -1
                              )
                            }
                            disabled={
                              savingStockId ===
                                product.id ||
                              Number(
                                stockDrafts[
                                  product.id
                                ] ??
                                  product.stock ??
                                  0
                              ) <= 0
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 text-lg font-bold text-gray-900 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Decrease stock for ${product.title}`}
                          >
                            −
                          </button>

                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={
                              stockDrafts[
                                product.id
                              ] ??
                              product.stock ??
                              0
                            }
                            onChange={(event) =>
                              handleStockChange(
                                product.id,
                                event.target.value
                              )
                            }
                            className="h-10 w-24 rounded-xl border border-gray-300 bg-white px-3 text-center text-sm font-semibold text-gray-900 outline-none focus:border-gray-500 focus:ring-3 focus:ring-gray-500/10"
                            aria-label={`Stock quantity for ${product.title}`}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              changeStock(
                                product.id,
                                1
                              )
                            }
                            disabled={
                              savingStockId ===
                              product.id
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 text-lg font-bold text-gray-900 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Increase stock for ${product.title}`}
                          >
                            +
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              saveStock(product)
                            }
                            disabled={
                              savingStockId ===
                                product.id ||
                              Number(
                                stockDrafts[
                                  product.id
                                ] ??
                                  product.stock ??
                                  0
                              ) ===
                                Number(
                                  product.stock ??
                                    0
                                )
                            }
                            className="flex h-10 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {savingStockId ===
                            product.id
                              ? "Saving..."
                              : "Save Stock"}
                          </button>

                        </div>

                      </div>


                      {/* ACTIONS */}

                      <div className="flex shrink-0 gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleEditProduct(
                              product
                            )
                          }
                          className="flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                        >

                          <FiEdit2 size={16} />

                          <span className="hidden sm:inline">
                            Edit
                          </span>

                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteProduct(
                              product
                            )
                          }
                          className="flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >

                          <FiTrash2 size={16} />

                          <span className="hidden sm:inline">
                            Delete
                          </span>

                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            )}

        </div>

      </section>

    </main>
  );
}

export default AdminProducts;