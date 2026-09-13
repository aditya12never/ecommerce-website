import { useEffect, useState } from "react";
import {
  FiPackage,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
  FiUser,
  FiMail,
  FiDollarSign,
} from "react-icons/fi";

import { getOrders, updateOrderStatus } from "../services/orderService";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // ============================================================
  // LOAD ALL ORDERS
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrders();

        if (!cancelled) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (!cancelled) {
          setError(error.message || "Unable to load orders.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // STATUS HELPERS
  // ============================================================

  const normalizeStatus = (status) => {
    return status?.trim().toUpperCase() || "PLACED";
  };

  const getStatusClass = (status) => {
    const normalizedStatus = normalizeStatus(status);

    switch (normalizedStatus) {
      case "PLACED":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "PROCESSING":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "SHIPPED":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "DELIVERED":
        return "bg-green-50 text-green-700 border-green-200";

      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    const normalizedStatus = normalizeStatus(status);

    switch (normalizedStatus) {
      case "PLACED":
        return <FiPackage size={16} />;

      case "PROCESSING":
        return <FiClock size={16} />;

      case "SHIPPED":
        return <FiTruck size={16} />;

      case "DELIVERED":
        return <FiCheckCircle size={16} />;

      case "CANCELLED":
        return <FiXCircle size={16} />;

      default:
        return <FiPackage size={16} />;
    }
  };

  const getNextStatuses = (status) => {
    const normalizedStatus = normalizeStatus(status);

    switch (normalizedStatus) {
      case "PLACED":
        return ["PROCESSING", "CANCELLED"];

      case "PROCESSING":
        return ["SHIPPED", "CANCELLED"];

      case "SHIPPED":
        return ["DELIVERED"];

      case "DELIVERED":
        return [];

      case "CANCELLED":
        return [];

      default:
        return [];
    }
  };

  // ============================================================
  // UPDATE ORDER STATUS
  // ============================================================

  const handleStatusChange = async (orderId, currentStatus, newStatus) => {
    const current = normalizeStatus(currentStatus);
    const next = normalizeStatus(newStatus);

    if (current === next) {
      return;
    }

    if (next === "CANCELLED") {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this order?\n\nThe ordered product stock will be restored."
      );

      if (!confirmed) {
        return;
      }
    }

    try {
      setUpdatingId(orderId);
      setError("");
      setSuccess("");

      const updatedOrder = await updateOrderStatus(orderId, next);

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                ...(updatedOrder || {}),
                status: next,
              }
            : order
        )
      );

      if (next === "CANCELLED") {
        setSuccess(
          `Order #${orderId} cancelled successfully. Product stock has been restored.`
        );
      } else {
        setSuccess(
          `Order #${orderId} status updated to ${next}.`
        );
      }
    } catch (error) {
      setError(
        error.message || "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ============================================================
  // FORMAT HELPERS
  // ============================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "N/A";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value) => {
    const amount = Number(value) || 0;

    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });
  };

  // ============================================================
  // ADDRESS HELPER
  // ============================================================

  const formatAddress = (order) => {
    const address =
      order.shippingAddress ||
      order.address ||
      {};

    if (typeof address === "string") {
      return address;
    }

    const parts = [
      address.fullName,
      address.name,
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.pincode,
      address.zipCode,
      address.postalCode,
      address.country,
    ].filter(Boolean);

    if (parts.length > 0) {
      return parts.join(", ");
    }

    return "Shipping address not available";
  };

  // ============================================================
  // ORDER TOTAL
  // ============================================================

  const getOrderTotal = (order) => {
    if (order.totalAmount !== undefined && order.totalAmount !== null) {
      return order.totalAmount;
    }

    if (order.total !== undefined && order.total !== null) {
      return order.total;
    }

    if (Array.isArray(order.items)) {
      return order.items.reduce((total, item) => {
        const quantity = Number(item.quantity) || 0;
        const price =
          Number(item.price) ||
          Number(item.product?.price) ||
          0;

        return total + quantity * price;
      }, 0);
    }

    return 0;
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <section className="shop-section shop-section-md">
        <div className="shop-container">
          <div className="flex min-h-75 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

              <p className="text-sm text-gray-500">
                Loading orders...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <section className="shop-section shop-section-md">
      <div className="shop-container">

        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white">
              <FiPackage size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Manage Orders
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View and manage customer orders
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Total Orders
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {orders.length}
              </p>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                Placed
              </p>

              <p className="mt-1 text-xl font-bold text-blue-700">
                {
                  orders.filter(
                    (order) =>
                      normalizeStatus(order.status) === "PLACED"
                  ).length
                }
              </p>
            </div>

            <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-yellow-600">
                Processing
              </p>

              <p className="mt-1 text-xl font-bold text-yellow-700">
                {
                  orders.filter(
                    (order) =>
                      normalizeStatus(order.status) === "PROCESSING"
                  ).length
                }
              </p>
            </div>

            <div className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-purple-600">
                Shipped
              </p>

              <p className="mt-1 text-xl font-bold text-purple-700">
                {
                  orders.filter(
                    (order) =>
                      normalizeStatus(order.status) === "SHIPPED"
                  ).length
                }
              </p>
            </div>

            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-green-600">
                Delivered
              </p>

              <p className="mt-1 text-xl font-bold text-green-700">
                {
                  orders.filter(
                    (order) =>
                      normalizeStatus(order.status) === "DELIVERED"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================
            SUCCESS MESSAGE
        ====================================================== */}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <FiCheckCircle className="mt-0.5 shrink-0" size={18} />

            <p>{success}</p>
          </div>
        )}

        {/* ======================================================
            ERROR MESSAGE
        ====================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <FiXCircle className="mt-0.5 shrink-0" size={18} />

            <p>{error}</p>
          </div>
        )}

        {/* ======================================================
            NO ORDERS
        ====================================================== */}

        {orders.length === 0 ? (
          <div className="shop-card p-10 text-center sm:p-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <FiPackage size={28} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No orders found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              There are currently no customer orders in the system.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {/* ==================================================
                ORDER LIST
            ================================================== */}

            {orders.map((order) => {
              const status = normalizeStatus(order.status);
              const nextStatuses = getNextStatuses(status);
              const isUpdating = updatingId === order.id;

              const items = Array.isArray(order.items)
                ? order.items
                : [];

              return (
                <article
                  key={order.id}
                  className="shop-card overflow-hidden"
                >

                  {/* ============================================
                      ORDER HEADER
                  ============================================ */}

                  <div className="border-b border-gray-200 bg-gray-50 p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-lg font-bold text-gray-900">
                            Order #{order.id}
                          </h2>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                              status
                            )}`}
                          >
                            {getStatusIcon(status)}
                            {status}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                          {formatDate(
                            order.createdAt ||
                              order.orderDate ||
                              order.createdDate
                          )}
                        </p>
                      </div>

                      {/* STATUS CONTROL */}

                      {nextStatuses.length > 0 ? (
                        <div className="flex w-full flex-col gap-2 sm:w-auto">
                          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Update Status
                          </label>

                          <select
                            value=""
                            disabled={isUpdating}
                            onChange={(event) => {
                              const value = event.target.value;

                              if (value) {
                                handleStatusChange(
                                  order.id,
                                  status,
                                  value
                                );
                              }
                            }}
                            className="h-11 min-h-75 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 outline-none transition focus:border-gray-500 focus:ring-3 focus:ring-gray-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <option value="">
                              {isUpdating
                                ? "Updating..."
                                : "Change status"}
                            </option>

                            {nextStatuses.map((nextStatus) => (
                              <option
                                key={nextStatus}
                                value={nextStatus}
                              >
                                {nextStatus}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-gray-500">
                          {status === "DELIVERED"
                            ? "Order completed"
                            : "No further actions"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ============================================
                      ORDER INFORMATION
                  ============================================ */}

                  <div className="grid gap-6 border-b border-gray-200 p-5 sm:p-6 lg:grid-cols-3">

                    {/* CUSTOMER */}

                    <div>
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <FiUser size={17} />
                        Customer
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium text-gray-900">
                            {order.customerName ||
                              order.name ||
                              order.userName ||
                              "Customer"}
                          </span>
                        </p>

                        <p className="flex items-start gap-2 break-all">
                          <FiMail
                            className="mt-0.5 shrink-0"
                            size={15}
                          />

                          {order.email ||
                            order.customerEmail ||
                            order.userEmail ||
                            "Email not available"}
                        </p>
                      </div>
                    </div>

                    {/* TOTAL */}

                    <div>
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <FiDollarSign size={17} />
                        Order Total
                      </div>

                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(getOrderTotal(order))}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {items.length}{" "}
                        {items.length === 1 ? "item" : "items"}
                      </p>
                    </div>

                    {/* SHIPPING ADDRESS */}

                    <div>
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <FiMapPin size={17} />
                        Shipping Address
                      </div>

                      <p className="text-sm leading-6 text-gray-600">
                        {formatAddress(order)}
                      </p>
                    </div>
                  </div>

                  {/* ============================================
                      ORDER ITEMS
                  ============================================ */}

                  <div className="p-5 sm:p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-base font-bold text-gray-900">
                        Order Items
                      </h3>

                      <span className="text-sm text-gray-500">
                        {items.length}{" "}
                        {items.length === 1 ? "item" : "items"}
                      </span>
                    </div>

                    {items.length === 0 ? (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-500">
                        No items found for this order.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <div className="min-w-162.5 overflow-hidden rounded-xl border border-gray-200">

                          {/* TABLE HEADER */}

                          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            <span>Product</span>
                            <span>Price</span>
                            <span>Quantity</span>
                            <span className="text-right">
                              Subtotal
                            </span>
                          </div>

                          {/* ITEMS */}

                          {items.map((item, index) => {
                            const product =
                              item.product || {};

                            const productName =
                              item.productName ||
                              product.title ||
                              product.name ||
                              `Product ${index + 1}`;

                            const price =
                              Number(item.price) ||
                              Number(product.price) ||
                              0;

                            const quantity =
                              Number(item.quantity) || 0;

                            const subtotal =
                              price * quantity;

                            const image =
                              item.image ||
                              product.image ||
                              "";

                            return (
                              <div
                                key={
                                  item.id ||
                                  item.productId ||
                                  product.id ||
                                  index
                                }
                                className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-4 border-b border-gray-100 px-4 py-4 last:border-b-0"
                              >
                                {/* PRODUCT */}

                                <div className="flex min-w-0 items-center gap-3">
                                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                    {image ? (
                                      <img
                                        src={image}
                                        alt={productName}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                                        <FiPackage
                                          size={20}
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-gray-900">
                                      {productName}
                                    </p>

                                    {(item.productId ||
                                      product.id) && (
                                      <p className="mt-1 text-xs text-gray-500">
                                        Product ID:{" "}
                                        {item.productId ||
                                          product.id}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* PRICE */}

                                <div className="text-sm text-gray-600">
                                  {formatCurrency(price)}
                                </div>

                                {/* QUANTITY */}

                                <div className="text-sm font-medium text-gray-900">
                                  × {quantity}
                                </div>

                                {/* SUBTOTAL */}

                                <div className="text-right text-sm font-semibold text-gray-900">
                                  {formatCurrency(subtotal)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )} 
                  </div>

                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminOrders;