"use client";
import { OrderType } from "../components/types";

export default function OrderDetailModal({
  order,
  onClose,
}: {
  order: OrderType;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto text-gray-200 m-5">
        <h3 className="text-base font-bold text-center mb-4">ORDER DETAIL</h3>
        <hr className="border-t-2 border-gray-400" />
        <hr className="border-t border-gray-400 mt-1" />
        <div className="space-y-3 text-sm mt-4">
          <p>
            <span className="font-semibold inline-block w-36">Order ID</span>
            <span>: {order.orderId}</span>
          </p>

          <p>
            <span className="font-semibold inline-block w-36">Customer</span>
            <span>: {order.userData.name}</span>
          </p>
          {/* <p><span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleString()}</p> */}
          <p>
            <span className="font-semibold inline-block w-36">Date</span>
            <span>
              :{" "}
              {new Date(order.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </p>

          <p>
            <span className="font-semibold inline-block w-36">Status</span>
            <span>: {order.status}</span>
          </p>

          <p>
            <span className="font-semibold inline-block w-36">Total</span>
            <span>: IDR {order.estimatedPrice.toLocaleString("id-ID")}</span>
          </p>

          <p>
            <span className="font-semibold inline-block w-36">Notes</span>
            <span>: {order.additionalNotes || "-"}</span>
          </p>
          <hr className="border-t border-gray-600 mt-1" />
          <p>
            <span className="font-semibold text-sm">PDF Order URL </span>
            <br></br>
            {order.pdf_url ? (
              <a
                href={order.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-greenmaincolor hover:underline"
              >
                {order.pdf_url}
              </a>
            ) : (
              "-"
            )}
          </p>
        </div>
        <hr className="border-t border-gray-600 mt-4" />
        <div className="mt-4">
          <h3 className="font-semibold text-sm mb-2">Processing Types</h3>
          <div className="flex flex-wrap gap-2">
            {order.processingTypes.map((type, i) => (
              <span key={i} className="px-2 py-1 bg-green-700 rounded text-xs">
                {type}
              </span>
            ))}
          </div>
        </div>
        <hr className="border-t border-gray-600 mt-4" />
        <div className="mt-4">
          <h3 className="font-semibold text-sm mb-2">Selected Items</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {order.selectedItems.map((item, i) => (
              <li key={i}>
                {item.collection_vehicle_short} - {item.collection_date} with
                resolution {item.resolution}
              </li>
            ))}
          </ul>
        </div>
        <hr className="border-t border-gray-600 mt-4" />
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
