import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { createOrder } from "../services/orderService";

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setNotification({
        show: true,
        type: "danger",
        message: "Please fill in all customer details",
      });
      return false;
    }

    if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
      setNotification({
        show: true,
        type: "danger",
        message: "Please fill in all address details",
      });
      return false;
    }

    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) {
      setNotification({
        show: true,
        type: "danger",
        message: "Please fill in all payment details",
      });
      return false;
    }

    if (cartItems.length === 0) {
      setNotification({
        show: true,
        type: "danger",
        message: "Your cart is empty",
      });
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const orderData = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        items: cartItems.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: getCartTotal(),
        paymentMethod: "Credit Card",
      };

      await createOrder(orderData, token);

      setNotification({
        show: true,
        type: "success",
        message: "Order placed successfully!",
      });

      // Clear cart after successful order
      clearCart();

      // Redirect to home page after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setNotification({
        show: true,
        type: "danger",
        message: error.message || "Failed to place order. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <div className="page-heading" id="top">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="inner-content">
                  <h2>Checkout</h2>
                  <span>Complete your purchase</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="section" id="checkout">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center">
                <p className="mb-4">Your cart is empty. Please add items before checking out.</p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="page-heading" id="top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-content">
                <h2>Checkout</h2>
                <span>Complete your purchase</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section" id="checkout">
        <div className="container">
          {notification.show && (
            <div className={`alert alert-${notification.type} mb-4`} role="alert">
              {notification.message}
            </div>
          )}

          <form onSubmit={handleSubmitOrder}>
            <div className="row">
              {/* Billing Information */}
              <div className="col-lg-8">
                <div className="card mb-4">
                  <div className="card-header">
                    <h5>Billing Information</h5>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-lg-6">
                        <label className="form-label">First Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-lg-6">
                        <label className="form-label">Last Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-lg-6">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-lg-6">
                        <label className="form-label">Phone Number *</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5>Shipping Address</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Address *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Street address"
                        required
                      />
                    </div>

                    <div className="row mb-3">
                      <div className="col-lg-6">
                        <label className="form-label">City *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-lg-6">
                        <label className="form-label">State *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Zip Code *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5>Payment Information</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Card Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Expiry Date *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          maxLength="5"
                          required
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">CVV *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength="4"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-header">
                    <h5>Order Summary</h5>
                  </div>
                  <div className="card-body">
                    <div className="order-items" style={{ maxHeight: "400px", overflowY: "auto" }}>
                      {cartItems.map((item) => (
                        <div key={item.id} className="d-flex justify-content-between mb-3 pb-2 border-bottom">
                          <div>
                            <p className="mb-1">
                              <strong>{item.name}</strong>
                            </p>
                            <small className="text-muted">Qty: {item.quantity}</small>
                          </div>
                          <div className="text-right">
                            <p className="mb-0">
                              <strong>₹ {(item.price * item.quantity).toFixed(2)}</strong>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <hr />

                    <div className="row mb-3">
                      <div className="col-6">
                        <span>Subtotal:</span>
                      </div>
                      <div className="col-6 text-right">
                        <strong>₹ {getCartTotal().toFixed(2)}</strong>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-6">
                        <span>Shipping:</span>
                      </div>
                      <div className="col-6 text-right">
                        <strong>₹ 0.00</strong>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-6">
                        <span>Tax:</span>
                      </div>
                      <div className="col-6 text-right">
                        <strong>₹ 0.00</strong>
                      </div>
                    </div>

                    <hr />

                    <div className="row">
                      <div className="col-6">
                        <strong>Total:</strong>
                      </div>
                      <div className="col-6 text-right">
                        <strong style={{ fontSize: "18px" }}>₹ {getCartTotal().toFixed(2)}</strong>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 mt-4"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Place Order"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default Checkout;
