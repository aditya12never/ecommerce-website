import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiPackage,
  FiShoppingBag,
  FiAlertCircle,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

import { getMyOrders, cancelOrder } from "../services/orderService";
import { useAuth } from "../context/useAuth";

function Orders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.email) {
        setError("Unable to identify your account.");
        setIsLoading(false);
        return;
      }

      try {
        setError("");

        const data = await getMyOrders();

        setOrders(data);
      } catch (error) {
        console.error("Orders error:", error);

        setError(
          error.message ||
            "Unable to load your orders."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const handleCancelOrder = async (order) => {
    const normalizedStatus =
      order.status?.toUpperCase();

    if (
      normalizedStatus !== "PLACED" &&
      normalizedStatus !== "PROCESSING"
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel order #${order.id}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      setCancellingId(order.id);

      await cancelOrder(order.id);

      setOrders((currentOrders) =>
        currentOrders.map((item) =>
          item.id === order.id
            ? {
                ...item,
                status: "CANCELLED",
              }
            : item
        )
      );

      setSuccess(
        `Order #${order.id} was cancelled successfully. The product stock has been restored.`
      );
    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      );

      setError(
        error.message ||
          "Unable to cancel this order."
      );
    } finally {
      setCancellingId(null);
    }
  };


  const getStatusIcon = (status) => {
    const normalizedStatus =
      status?.toUpperCase();

    if (normalizedStatus === "DELIVERED") {
      return <FiCheckCircle size={16} />;
    }

    return <FiClock size={16} />;
  };

  const getStatusClass = (status) => {
    const normalizedStatus =
      status?.toUpperCase();

    if (normalizedStatus === "DELIVERED") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (normalizedStatus === "CANCELLED") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  };

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <section className="shop-page-header">
        <div className="shop-container">
          <div className="shop-page-header-inner">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white">
                <FiPackage size={23} />
              </div>

              <div>

                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  My Orders
                </h1>

                <p className="mt-1 text-sm text-gray-500 sm:text-base">
                  View your ShopZone order history.
                </p>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Orders */}
      <section className="shop-section shop-section-md">

        <div className="shop-container">

          {/* Loading */}
          {isLoading && (
            <div className="flex min-h-[300px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

                <p className="mt-4 text-sm text-gray-500">
                  Loading your orders...
                </p>

              </div>

            </div>
          )}

          {/* Success */}
          {!isLoading && success && (
            <div className="mb-6 mx-auto max-w-4xl rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
              {success}
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6">

              <div className="flex items-start gap-3">

                <FiAlertCircle
                  className="mt-0.5 shrink-0 text-red-500"
                  size={22}
                />

                <div>

                  <h2 className="font-semibold text-red-800">
                    Unable to load orders
                  </h2>

                  <p className="mt-1 text-sm text-red-700">
                    {error}
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* Empty */}
          {!isLoading &&
            !error &&
            orders.length === 0 && (
              <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <FiShoppingBag size={34} />
                </div>

                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                  No Orders Yet
                </h2>

                <p className="mt-2 text-gray-500">
                  You haven't placed any orders yet.
                  Start shopping and your orders will
                  appear here.
                </p>

                <Link
                  to="/products"
                  className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
                >
                  <FiShoppingBag size={17} />
                  Start Shopping
                </Link>

              </div>
            )}

          {/* Order List */}
          {!isLoading &&
            !error &&
            orders.length > 0 && (

              <div className="mx-auto max-w-4xl space-y-6">

                {orders.map((order) => (

                  <article
                    key={order.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                  >

                    {/* Order Header */}
                    <div className="border-b border-gray-200 bg-gray-50 p-5 sm:p-6">

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Order
                          </p>

                          <h2 className="mt-1 text-lg font-bold text-gray-900">
                            #{order.id}
                          </h2>

                        </div>

                        <div
                          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                            order.status
                          )}`}
                        >

                          {getStatusIcon(order.status)}

                          {order.status || "PLACED"}

                        </div>

                      </div>

                    </div>

                    {/* Order Information */}
                    <div className="grid gap-4 border-b border-gray-200 p-5 sm:grid-cols-3 sm:p-6">

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Customer
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {order.customerName}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Email
                        </p>

                        <p className="mt-1 break-all text-sm text-gray-700">
                          {order.email}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Total
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          ₹
                          {Number(
                            order.totalAmount
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>

                    </div>

                    {/* Address */}
                    <div className="border-b border-gray-200 p-5 sm:p-6">

                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Delivery Address
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-700">
                        {order.address}
                      </p>

                    </div>

                    {/* Products */}
                    <div className="p-5 sm:p-6">

                      <div className="mb-4 flex items-center justify-between">

                        <h3 className="font-bold text-gray-900">
                          Ordered Products
                        </h3>

                        <span className="text-sm text-gray-500">
                          {order.items?.length || 0} item
                          {order.items?.length === 1
                            ? ""
                            : "s"}
                        </span>

                      </div>

                      <div className="space-y-3">

                        {order.items?.map((item) => (

                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-4"
                          >

                            <div className="min-w-0">

                              <p className="truncate text-sm font-semibold text-gray-900">
                                {item.productTitle}
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                Quantity: {item.quantity}
                              </p>

                            </div>

                            <p className="shrink-0 text-sm font-bold text-gray-900">
                              ₹
                              {Number(
                                item.price *
                                  item.quantity
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>

                          </div>

                        ))}

                      </div>

                      {/* CANCEL ORDER */}

                      {(order.status?.toUpperCase() === "PLACED" ||
                        order.status?.toUpperCase() === "PROCESSING") && (
                        <div className="mt-5 flex justify-end border-t border-gray-200 pt-5">

                          <button
                            type="button"
                            onClick={() =>
                              handleCancelOrder(order)
                            }
                            disabled={
                              cancellingId === order.id
                            }
                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-200 bg-white px-5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {cancellingId === order.id
                              ? "Cancelling..."
                              : "Cancel Order"}
                          </button>

                        </div>
                      )}

                    </div>

                  </article>

                ))}

              </div>

            )}

        </div>

      </section>

    </main>
  );
}

export default Orders;