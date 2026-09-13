import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiArrowRight,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiRefreshCw,
} from "react-icons/fi";

import { useAuth } from "../context/useAuth";
import { getProducts } from "../services/productService";
import { getOrders } from "../services/orderService";

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  title,
  value,
  description,
  icon,
  loading,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold text-gray-900">
            {loading ? "—" : value}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            {description}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white">
          {icon}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN DASHBOARD
// ============================================================

function AdminDashboard() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD / REFRESH DASHBOARD DATA
  // ==========================================================

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [productsData, ordersData] =
        await Promise.all([
          getProducts(),
          getOrders(),
        ]);

      setProducts(
        Array.isArray(productsData)
          ? productsData
          : []
      );

      setOrders(
        Array.isArray(ordersData)
          ? ordersData
          : []
      );
    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error
      );

      setError(
        error.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================================
  // INITIAL DASHBOARD LOAD
  // ==========================================================

  useEffect(() => {
    let cancelled = false;

    const fetchDashboardData = async () => {
      try {
        const [productsData, ordersData] =
          await Promise.all([
            getProducts(),
            getOrders(),
          ]);

        if (cancelled) {
          return;
        }

        setProducts(
          Array.isArray(productsData)
            ? productsData
            : []
        );

        setOrders(
          Array.isArray(ordersData)
            ? ordersData
            : []
        );

        setError("");
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Admin dashboard error:",
          error
        );

        setError(
          error.message ||
            "Unable to load dashboard data."
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================================
  // ORDER STATISTICS
  // ==========================================================

  const orderStats = useMemo(() => {
    const stats = {
      placed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      const status =
        order?.status
          ?.trim()
          ?.toUpperCase();

      if (status === "PLACED") {
        stats.placed += 1;
      } else if (status === "PROCESSING") {
        stats.processing += 1;
      } else if (status === "SHIPPED") {
        stats.shipped += 1;
      } else if (status === "DELIVERED") {
        stats.delivered += 1;
      } else if (status === "CANCELLED") {
        stats.cancelled += 1;
      }
    });

    return stats;
  }, [orders]);

  // ==========================================================
  // LOW STOCK PRODUCTS
  // ==========================================================

  const lowStockProducts = useMemo(() => {
    return products.filter((product) => {
      const stock = Number(
        product?.stock ?? 0
      );

      return stock > 0 && stock <= 5;
    });
  }, [products]);

  // ==========================================================
  // OUT OF STOCK PRODUCTS
  // ==========================================================

  const outOfStockProducts = useMemo(() => {
    return products.filter((product) => {
      const stock = Number(
        product?.stock ?? 0
      );

      return stock <= 0;
    });
  }, [products]);

  // ==========================================================
  // RECENT ORDERS
  // ==========================================================

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const dateA = new Date(
          a?.createdAt || 0
        ).getTime();

        const dateB = new Date(
          b?.createdAt || 0
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [orders]);

  // ==========================================================
  // SALES STATISTICS
  // ==========================================================

  const salesStats = useMemo(() => {
    let totalSales = 0;
    let activeSales = 0;
    let deliveredSales = 0;

    orders.forEach((order) => {
      const status =
        order?.status
          ?.trim()
          ?.toUpperCase() || "";

      const amount = Number(
        order?.totalAmount ??
          order?.total ??
          0
      );

      // Cancelled orders are excluded
      // from total sales.

      if (status !== "CANCELLED") {
        totalSales += amount;
      }

      // Active orders

      if (
        status === "PLACED" ||
        status === "PROCESSING" ||
        status === "SHIPPED"
      ) {
        activeSales += amount;
      }

      // Delivered orders

      if (status === "DELIVERED") {
        deliveredSales += amount;
      }
    });

    return {
      totalSales,
      activeSales,
      deliveredSales,
    };
  }, [orders]);

  // ==========================================================
  // ERROR STATE
  // ==========================================================

  if (error && !isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">

        <section className="border-b border-gray-200 bg-white">

          <div className="shop-container">

            <div className="py-10 sm:py-14">

              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Administration
              </p>

              <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                Admin Dashboard
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Welcome back,{" "}
                {user?.name || "Admin"}.
                Manage your ShopZone store
                from here.
              </p>

            </div>

          </div>

        </section>


        <section className="shop-section shop-section-md">

          <div className="shop-container">

            <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-red-600">
                  <FiAlertTriangle size={22} />
                </div>

                <div className="flex-1">

                  <h2 className="font-bold text-red-800">
                    Unable to load dashboard
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-red-700">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={loadDashboardData}
                    className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    <FiRefreshCw size={16} />
                    Try Again
                  </button>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>
    );
  }

  // ==========================================================
  // MAIN DASHBOARD
  // ==========================================================

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="border-b border-gray-200 bg-white">

        <div className="shop-container">

          <div className="py-10 sm:py-14">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Administration
                </p>

                <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                  Admin Dashboard
                </h1>

                <p className="mt-2 text-sm text-gray-500 sm:text-base">
                  Welcome back,{" "}
                  {user?.name || "Admin"}.
                  Manage your ShopZone store
                  from here.
                </p>

              </div>


              {/* REFRESH */}

              <button
                type="button"
                onClick={loadDashboardData}
                disabled={isLoading}
                className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
              >

                <FiRefreshCw
                  size={16}
                  className={
                    isLoading
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh

              </button>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          DASHBOARD CONTENT
      ====================================================== */}

      <section className="shop-section shop-section-md">

        <div className="shop-container">


          {/* ==================================================
              STORE OVERVIEW
          ================================================== */}

          <div>

            <div className="mb-5">

              <h2 className="text-xl font-bold text-gray-900">
                Store Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current ShopZone inventory and
                order statistics.
              </p>

            </div>


            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <StatCard
                title="Total Products"
                value={products.length}
                description="Products currently in the store"
                icon={
                  <FiPackage size={22} />
                }
                loading={isLoading}
              />


              <StatCard
                title="Total Orders"
                value={orders.length}
                description="Orders received by ShopZone"
                icon={
                  <FiShoppingBag size={22} />
                }
                loading={isLoading}
              />


              <StatCard
                title="Processing"
                value={
                  orderStats.processing
                }
                description="Orders currently being processed"
                icon={
                  <FiClock size={22} />
                }
                loading={isLoading}
              />


              <StatCard
                title="Delivered"
                value={
                  orderStats.delivered
                }
                description="Successfully delivered orders"
                icon={
                  <FiCheckCircle size={22} />
                }
                loading={isLoading}
              />

            </div>

          </div>


          {/* ==================================================
              ORDER STATUS
          ================================================== */}

          <div className="mt-10">

            <div className="mb-5">

              <h2 className="text-xl font-bold text-gray-900">
                Order Status
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Breakdown of customer orders
                by their current status.
              </p>

            </div>


            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">


              {/* PLACED */}

              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

                <div className="flex items-center justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-yellow-700">
                    <FiShoppingBag size={20} />
                  </div>

                  <span className="text-2xl font-bold text-yellow-800">
                    {isLoading
                      ? "—"
                      : orderStats.placed}
                  </span>

                </div>

                <p className="mt-4 font-bold text-yellow-900">
                  Placed
                </p>

                <p className="mt-1 text-xs text-yellow-700">
                  Newly placed orders
                </p>

              </div>


              {/* PROCESSING */}

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">

                <div className="flex items-center justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-700">
                    <FiClock size={20} />
                  </div>

                  <span className="text-2xl font-bold text-blue-800">
                    {isLoading
                      ? "—"
                      : orderStats.processing}
                  </span>

                </div>

                <p className="mt-4 font-bold text-blue-900">
                  Processing
                </p>

                <p className="mt-1 text-xs text-blue-700">
                  Orders being prepared
                </p>

              </div>


              {/* SHIPPED */}

              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">

                <div className="flex items-center justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-700">
                    <FiTruck size={20} />
                  </div>

                  <span className="text-2xl font-bold text-indigo-800">
                    {isLoading
                      ? "—"
                      : orderStats.shipped}
                  </span>

                </div>

                <p className="mt-4 font-bold text-indigo-900">
                  Shipped
                </p>

                <p className="mt-1 text-xs text-indigo-700">
                  Orders on the way
                </p>

              </div>


              {/* DELIVERED */}

              <div className="rounded-2xl border border-green-200 bg-green-50 p-5">

                <div className="flex items-center justify-between">

                  <div className="flex h-10 w-10 items-center justify-between">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-green-700">
                      <FiCheckCircle size={20} />
                    </div>

                  </div>

                  <span className="text-2xl font-bold text-green-800">
                    {isLoading
                      ? "—"
                      : orderStats.delivered}
                  </span>

                </div>

                <p className="mt-4 font-bold text-green-900">
                  Delivered
                </p>

                <p className="mt-1 text-xs text-green-700">
                  Successfully completed
                </p>

              </div>


              {/* CANCELLED */}

              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

                <div className="flex items-center justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-700">
                    <FiXCircle size={20} />
                  </div>

                  <span className="text-2xl font-bold text-red-800">
                    {isLoading
                      ? "—"
                      : orderStats.cancelled}
                  </span>

                </div>

                <p className="mt-4 font-bold text-red-900">
                  Cancelled
                </p>

                <p className="mt-1 text-xs text-red-700">
                  Cancelled orders
                </p>

              </div>

            </div>

          </div>


          {/* ==================================================
              SALES OVERVIEW
          ================================================== */}

          <div className="mt-10">

            <div className="mb-5">

              <h2 className="text-xl font-bold text-gray-900">
                Sales Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current sales performance across ShopZone orders.
              </p>

            </div>


            <div className="grid gap-5 md:grid-cols-3">


              {/* TOTAL SALES */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="text-sm font-semibold text-gray-500">
                      Total Sales
                    </p>

                    <p className="mt-3 text-3xl font-bold text-gray-900">

                      {isLoading
                        ? "—"
                        : `₹${salesStats.totalSales.toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}`}

                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      Sales excluding cancelled orders
                    </p>

                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-xl font-bold text-white">
                    ₹
                  </div>

                </div>

              </div>


              {/* ACTIVE SALES */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="text-sm font-semibold text-gray-500">
                      Active Sales
                    </p>

                    <p className="mt-3 text-3xl font-bold text-gray-900">

                      {isLoading
                        ? "—"
                        : `₹${salesStats.activeSales.toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}`}

                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      Placed, processing and shipped orders
                    </p>

                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white">
                    <FiShoppingBag size={22} />
                  </div>

                </div>

              </div>


              {/* DELIVERED SALES */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="text-sm font-semibold text-gray-500">
                      Delivered Sales
                    </p>

                    <p className="mt-3 text-3xl font-bold text-gray-900">

                      {isLoading
                        ? "—"
                        : `₹${salesStats.deliveredSales.toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}`}

                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      Revenue from delivered orders
                    </p>

                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white">
                    <FiCheckCircle size={22} />
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================================
              RECENT ORDERS
          ================================================== */}

          <div className="mt-10">

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Recent Orders
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  The latest customer orders received by ShopZone.
                </p>

              </div>

              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:underline"
              >
                View All Orders
                <FiArrowRight size={16} />
              </Link>

            </div>


            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

              {isLoading ? (
                <div className="p-8 text-center">

                  <FiRefreshCw
                    size={22}
                    className="mx-auto animate-spin text-gray-400"
                  />

                  <p className="mt-3 text-sm text-gray-500">
                    Loading recent orders...
                  </p>

                </div>
              ) : recentOrders.length === 0 ? (
                <div className="p-8 text-center">

                  <FiShoppingBag
                    size={28}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 font-semibold text-gray-700">
                    No orders yet
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Customer orders will appear here.
                  </p>

                </div>
              ) : (
                <div className="divide-y divide-gray-100">

                  {recentOrders.map((order) => {

                    const status =
                      order?.status
                        ?.trim()
                        ?.toUpperCase() ||
                      "UNKNOWN";

                    const statusClasses = {
                      PLACED:
                        "bg-yellow-50 text-yellow-700 border-yellow-200",

                      PROCESSING:
                        "bg-blue-50 text-blue-700 border-blue-200",

                      SHIPPED:
                        "bg-indigo-50 text-indigo-700 border-indigo-200",

                      DELIVERED:
                        "bg-green-50 text-green-700 border-green-200",

                      CANCELLED:
                        "bg-red-50 text-red-700 border-red-200",
                    };

                    const statusClass =
                      statusClasses[status] ||
                      "bg-gray-50 text-gray-700 border-gray-200";

                    const orderTotal = Number(
                      order?.totalAmount ??
                        order?.total ??
                        0
                    );

                    const itemCount =
                      Array.isArray(order?.items)
                        ? order.items.reduce(
                            (total, item) =>
                              total +
                              Number(
                                item?.quantity ?? 0
                              ),
                            0
                          )
                        : 0;

                    const orderDate =
                      order?.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "Date unavailable";

                    return (
                      <div
                        key={order.id}
                        className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                      >

                        {/* ORDER INFO */}

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="font-bold text-gray-900">
                              Order #{order.id}
                            </span>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass}`}
                            >
                              {status}
                            </span>

                          </div>

                          <p className="mt-2 truncate text-sm text-gray-500">
                            {order?.email ||
                              order?.userEmail ||
                              "Customer"}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {orderDate} •{" "}
                            {itemCount}{" "}
                            {itemCount === 1
                              ? "item"
                              : "items"}
                          </p>

                        </div>


                        {/* TOTAL + VIEW */}

                        <div className="flex items-center justify-between gap-5 sm:justify-end">

                          <p className="text-base font-bold text-gray-900">
                            ₹
                            {orderTotal.toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </p>

                          <Link
                            to="/admin/orders"
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                          >
                            View
                          </Link>

                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

            </div>

          </div>


          {/* ==================================================
              INVENTORY ALERTS
          ================================================== */}

          <div className="mt-10">

            <div className="mb-5">

              <h2 className="text-xl font-bold text-gray-900">
                Inventory Alerts
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Products that may require your attention.
              </p>

            </div>


            <div className="grid gap-5 md:grid-cols-2">


              {/* LOW STOCK */}

              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600">
                    <FiAlertTriangle size={22} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center justify-between gap-4">

                      <h3 className="font-bold text-orange-900">
                        Low Stock
                      </h3>

                      <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-orange-700">
                        {isLoading
                          ? "—"
                          : lowStockProducts.length}
                      </span>

                    </div>

                    <p className="mt-2 text-sm leading-6 text-orange-800">
                      Products with 1–5 items
                      remaining in inventory.
                    </p>

                    {lowStockProducts.length > 0 && (
                      <div className="mt-4 space-y-2">

                        {lowStockProducts
                          .slice(0, 3)
                          .map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3"
                            >

                              <span className="min-w-0 truncate text-sm font-semibold text-gray-800">
                                {product.title}
                              </span>

                              <span className="shrink-0 text-xs font-bold text-orange-700">
                                {product.stock} left
                              </span>

                            </div>
                          ))}

                      </div>
                    )}

                    {lowStockProducts.length > 3 && (
                      <p className="mt-3 text-xs font-semibold text-orange-700">
                        +{" "}
                        {lowStockProducts.length - 3}{" "}
                        more low-stock products
                      </p>
                    )}

                  </div>

                </div>

              </div>


              {/* OUT OF STOCK */}

              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-red-600">
                    <FiXCircle size={22} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center justify-between gap-4">

                      <h3 className="font-bold text-red-900">
                        Out of Stock
                      </h3>

                      <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-red-700">
                        {isLoading
                          ? "—"
                          : outOfStockProducts.length}
                      </span>

                    </div>

                    <p className="mt-2 text-sm leading-6 text-red-800">
                      Products that currently
                      cannot be purchased.
                    </p>

                    {outOfStockProducts.length > 0 && (
                      <div className="mt-4 space-y-2">

                        {outOfStockProducts
                          .slice(0, 3)
                          .map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3"
                            >

                              <span className="min-w-0 truncate text-sm font-semibold text-gray-800">
                                {product.title}
                              </span>

                              <span className="shrink-0 text-xs font-bold text-red-700">
                                Out of stock
                              </span>

                            </div>
                          ))}

                      </div>
                    )}

                    {outOfStockProducts.length === 0 &&
                      !isLoading && (
                        <p className="mt-4 text-sm font-semibold text-green-700">
                          All products currently
                          have stock.
                        </p>
                      )}

                    {outOfStockProducts.length > 3 && (
                      <p className="mt-3 text-xs font-semibold text-red-700">
                        +{" "}
                        {outOfStockProducts.length - 3}{" "}
                        more out-of-stock products
                      </p>
                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================================
              MANAGEMENT
          ================================================== */}

          <div className="mt-10">

            <div className="mb-5">

              <h2 className="text-xl font-bold text-gray-900">
                Management
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage the main areas of your ShopZone store.
              </p>

            </div>


            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">


              {/* PRODUCTS */}

              <Link
                to="/admin/products"
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white">
                    <FiPackage size={23} />
                  </div>

                  <FiArrowRight
                    size={20}
                    className="text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-gray-900"
                  />

                </div>

                <h2 className="mt-6 text-xl font-bold text-gray-900">
                  Products
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Add new products, update
                  existing products, manage
                  inventory, and remove products.
                </p>

                <p className="mt-5 text-sm font-semibold text-gray-900">
                  Manage Products →
                </p>

              </Link>


              {/* ORDERS */}

              <Link
                to="/admin/orders"
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white">
                    <FiShoppingBag size={23} />
                  </div>

                  <FiArrowRight
                    size={20}
                    className="text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-gray-900"
                  />

                </div>

                <h2 className="mt-6 text-xl font-bold text-gray-900">
                  Orders
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  View customer orders and
                  update their status from
                  placed through delivery.
                </p>

                <p className="mt-5 text-sm font-semibold text-gray-900">
                  Manage Orders →
                </p>

              </Link>


              {/* ADMIN ACCOUNT */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white">
                  <FiUsers size={23} />
                </div>

                <h2 className="mt-6 text-xl font-bold text-gray-900">
                  Admin Account
                </h2>

                <p className="mt-2 break-all text-sm leading-6 text-gray-500">
                  {user?.email ||
                    "Admin account"}
                </p>

                <div className="mt-5 inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700">
                  Role:{" "}
                  {user?.role || "ADMIN"}
                </div>

              </div>

            </div>

          </div>


          {/* ==================================================
              QUICK ACTIONS
          ================================================== */}

          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6">

            <h2 className="text-xl font-bold text-gray-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Quickly access the most important
              admin functions.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              <Link
                to="/admin/products"
                className="shop-btn shop-btn-primary"
              >
                <FiPackage size={17} />
                Manage Products
              </Link>

              <Link
                to="/admin/orders"
                className="shop-btn shop-btn-secondary"
              >
                <FiShoppingBag size={17} />
                View Orders
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default AdminDashboard;