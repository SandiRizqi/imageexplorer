"use client";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { getOrdersByUser } from "../../components/Tools";
import { useAuth } from "../../components/context/AuthProrider";
import OrderDetailModal from "../../components/OrderDetailModal";
import { OrderType } from "../../components/types";

const ITEMS_PER_PAGE = 15;

const typeColors: Record<string, string> = {
  rawdata: "bg-pink-700",
  imageprocessing: "bg-lime-600",
  imageanalysis: "bg-green-600",
  layouting: "bg-cyan-600",
};

const LoadingComponent = () => {
  return (
    <tr>
      <td colSpan={7} className="text-center py-6 text-gray-400">
        Loading orders...
      </td>
    </tr>
  );
};

export default function OrdersTable({
  onOrderSelect,
}: {
  onOrderSelect?: (orderId: string) => void;
}) {
  const { status } = useAuth();
  const [sortOrder, setSortOrder] = useState<"date" | "name">("date");
  const [userOrders, setUserOrders] = useState<OrderType[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (status === "authenticated") {
      setLoading(true);
      getOrdersByUser(setUserOrders).finally(() => setLoading(false));
    }
  }, [status]);

  const sortedOrders = [...userOrders].sort((a, b) => {
    if (sortOrder === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.userData.name.localeCompare(b.userData.name);
  });

  const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOrders = sortedOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-bold text-white">Orders List</h2>
        <div className="flex items-center space-x-4">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "date" | "name")}
            className="px-3 py-1 rounded-md text-sm bg-gray-700 text-gray-300 border border-gray-600"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>
          <span className="text-sm text-gray-400">
            Total Orders: {userOrders.length}
          </span>
        </div>
      </div>

      <div className="relative h-[calc(100%-25px)] flex flex-col">
        {/* Table Container with Scroll */}
        <div className="flex-1 overflow-auto border border-gray-500 rounded-lg">
          <table className="min-w-full divide-y divide-gray-700">
            {/* Header with Sticky Position */}
            <thead className="bg-maincolor sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Tasks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="bg-maincolor divide-y divide-gray-700">
              {loading ? (
                <LoadingComponent />
              ) : currentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                currentOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    onClick={() => {
                      setSelectedItem(order.orderId);
                      onOrderSelect?.(order.orderId);
                    }}
                    className={`cursor-pointer transition-colors duration-150 ${
                      selectedItem === order.orderId
                        ? "bg-secondarycolor"
                        : "hover:bg-secondarycolor"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                      {order.orderId.slice(0, 20)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                      {order.userData.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="flex flex-col space-y-2">
                        {order.processingTypes.map((type, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 text-xs font-semibold text-white rounded-lg whitespace-nowrap ${
                              typeColors[type] || "bg-gray-400"
                            }`}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                      IDR {order.estimatedPrice.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                          setShowDetail(true);
                        }}
                        className="px-3 py-1 bg-greensecondarycolor hover:bg-greenmaincolor text-black text-xs rounded-md transition-colors"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - Fixed at Bottom */}
        <div className="flex-shrink-0 bg-maincolor border-t border-gray-700 px-3 sm:px-4 py-3 rounded-b-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Showing Info */}
            <div className="text-xs sm:text-sm text-gray-400 order-2 sm:order-1">
              Showing {sortedOrders.length === 0 ? 0 : startIndex + 1} to{" "}
              {Math.min(startIndex + ITEMS_PER_PAGE, sortedOrders.length)} of{" "}
              {sortedOrders.length}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 sm:p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="First page"
              >
                <ChevronsLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className="p-1.5 sm:p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
              <span className="text-xs sm:text-sm text-gray-400 min-w-[80px] sm:min-w-[100px] text-center px-2">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 sm:p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 sm:p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Last page"
              >
                <ChevronsRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDetail && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}
