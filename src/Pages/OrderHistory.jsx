import { useEffect, useState } from "react";
import { getOrders } from "../services/orderService";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const data = await getOrders(token);
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "badge bg-warning";
      case "processing":
        return "badge bg-info";
      case "shipped":
        return "badge bg-primary";
      case "delivered":
        return "badge bg-success";
      case "cancelled":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <>
      <div className="page-heading" id="top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-content">
                <h2>Order History</h2>
                <span>View your past orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section" id="orders">
        <div className="container">
          {loading && <p className="text-center">Loading orders...</p>}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="alert alert-info" role="alert">
              You haven't placed any orders yet.
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="row">
              <div className="col-lg-12">
                <table className="table table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>₹ {Number(order.totalAmount).toFixed(2)}</td>
                        <td>
                          <span className={getStatusBadgeClass(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() =>
                              setExpandedOrder(
                                expandedOrder === order.id ? null : order.id
                              )
                            }
                          >
                            {expandedOrder === order.id ? "Hide" : "View"} Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Order Details */}
                {expandedOrder && (
                  <div className="card mt-4">
                    <div className="card-header">
                      <h5>
                        Order #{expandedOrder} Details
                        <button
                          className="btn btn-sm btn-close float-end"
                          onClick={() => setExpandedOrder(null)}
                        ></button>
                      </h5>
                    </div>
                    <div className="card-body">
                      {orders
                        .filter((order) => order.id === expandedOrder)
                        .map((order) => (
                          <div key={order.id}>
                            <div className="row mb-3">
                              <div className="col-md-6">
                                <p>
                                  <strong>Customer Name:</strong> {order.customerName}
                                </p>
                                <p>
                                  <strong>Email:</strong> {order.email}
                                </p>
                                <p>
                                  <strong>Phone:</strong> {order.phone}
                                </p>
                              </div>
                              <div className="col-md-6">
                                <p>
                                  <strong>Address:</strong> {order.address}
                                </p>
                                <p>
                                  <strong>Payment Method:</strong> {order.paymentMethod}
                                </p>
                                <p>
                                  <strong>Order Date:</strong>{" "}
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <hr />

                            <h6 className="mb-3">Items:</h6>
                            <table className="table table-sm table-bordered">
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Quantity</th>
                                  <th>Price</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items &&
                                  order.items.map((item, index) => (
                                    <tr key={index}>
                                      <td>{item.productName}</td>
                                      <td>{item.quantity}</td>
                                      <td>₹ {Number(item.price).toFixed(2)}</td>
                                      <td>
                                        ₹{" "}
                                        {(item.quantity * Number(item.price)).toFixed(2)}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>

                            <div className="text-right">
                              <p className="mt-3">
                                <strong>
                                  Total Amount: ₹{" "}
                                  {Number(order.totalAmount).toFixed(2)}
                                </strong>
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default OrderHistory;
