import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
  } = useContext(CartContext);

  return (
    <>
      <div className="page-heading" id="top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-content">
                <h2>Shopping Cart</h2>
                <span>Review your items</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section" id="cart">
        <div className="container">
          {cartItems.length === 0 ? (
            <div className="row">
              <div className="col-lg-12 text-center">
                <p className="mb-4">Your cart is empty</p>
                <Link to="/product" className="btn btn-primary">
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-lg-8">
                <table className="table table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={`http://localhost:5000/uploads/${item.image}`}
                              alt={item.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                marginRight: "10px",
                              }}
                            />
                            {item.name}
                          </div>
                        </td>
                        <td>₹ {item.price}</td>
                        <td>
                          <div className="quantity buttons_added">
                            <input
                              type="button"
                              value="-"
                              className="minus"
                              onClick={() =>
                                updateCartItemQuantity(
                                  item.id,
                                  item.quantity - 1
                                )
                              }
                            />
                            <input
                              type="number"
                              value={item.quantity}
                              className="input-text qty text"
                              readOnly
                            />
                            <input
                              type="button"
                              value="+"
                              className="plus"
                              onClick={() =>
                                updateCartItemQuantity(
                                  item.id,
                                  item.quantity + 1
                                )
                              }
                            />
                          </div>
                        </td>
                        <td>₹ {(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="col-lg-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Order Summary</h5>
                    <hr />
                    <div className="d-flex justify-content-between mb-3">
                      <span>Subtotal:</span>
                      <span>₹ {getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Shipping:</span>
                      <span>₹ 0.00</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Tax:</span>
                      <span>₹ 0.00</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-3">
                      <strong>Total:</strong>
                      <strong>₹ {getCartTotal().toFixed(2)}</strong>
                    </div>
                    <button className="btn btn-primary w-100 mb-2">
                      <Link to="/checkout" style={{ color: "white", textDecoration: "none" }}>
                        Proceed to Checkout
                      </Link>
                    </button>
                    <Link to="/product" className="btn btn-secondary w-100">
                      Continue Shopping
                    </Link>
                  </div>
                </div>

                <div className="card mt-3">
                  <div className="card-body">
                    <button
                      className="btn btn-outline-danger w-100"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Cart;
