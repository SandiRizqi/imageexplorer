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
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto text-gray-200">
                <h2 className="text-xl font-bold text-center mb-12">ORDER DETAIL</h2>
                <div className="space-y-3">
                    <p><span className="font-semibold">Order ID:</span> {order.orderId}</p>
                    <p><span className="font-semibold">Customer:</span> {order.userData.name}</p>
                    {/* <p><span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleString()}</p> */}
                    <p>
                        <span className="font-semibold">Date:</span>{" "}
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>

                    <p><span className="font-semibold">Status:</span> {order.status}</p>
                    <p><span className="font-semibold">Total:</span> IDR {order.estimatedPrice.toLocaleString("id-ID")}</p>
                    <p><span className="font-semibold">Notes:</span> {order.additionalNotes || "-"}</p>
                    <p>
                        <span className="font-semibold">PDF Order URL: </span><br></br>
                        {order.pdf_url ? (
                            <a
                                href={order.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {order.pdf_url}
                            </a>
                        ) : (
                            "-"
                        )}
                    </p>

                </div>

                <div className="mt-8">
                    <h3 className="font-semibold mb-2">Processing Types:</h3>
                    <div className="flex flex-wrap gap-2">
                        {order.processingTypes.map((type, i) => (
                            <span key={i} className="px-2 py-1 bg-green-700 rounded text-xs">{type}</span>
                        ))}
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="font-semibold mb-2">Selected Items:</h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        {order.selectedItems.map((item, i) => (
                            <li key={i}>
                                {item.collection_vehicle_short} - {item.collection_date} with resolution {item.resolution}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-6 text-right">
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
