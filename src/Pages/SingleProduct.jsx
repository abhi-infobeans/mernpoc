import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/productService";
import { CartContext } from "../context/CartContext";

function SingleProduct() {
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "" });
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        const data = await getProductById(id, token);
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const increase = () => setQty((prev) => prev + 1);
  const decrease = () => setQty((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
      setNotification({
        show: true,
        message: `${product.name} added to cart (Qty: ${qty})`,
      });
      setQty(1); // Reset quantity after adding
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "" });
      }, 3000);
    }
  };

  const totalPrice = product ? Number(product.price || 0) * qty : 0;

  return (
    <>
      <div className="page-heading" id="top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-content">
                <h2>Single Product Page</h2>
                <span>Product details</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section" id="product">
        <div className="container">
          {loading && <p>Loading product details...</p>}

          {notification.show && (
            <div className="alert alert-success mt-3" role="alert">
              {notification.message}
            </div>
          )}

          {!loading && error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && !id && (
            <div className="alert alert-info" role="alert">
              No product selected. Go to <Link to="/dashboard">Product List</Link> and select one.
            </div>
          )}

          {!loading && !error && product && (
            <div className="row">
              <div className="col-lg-8">
                <div className="left-images">
                  <img
                    src={`http://localhost:5000/uploads/${product.image}`}
                    alt={product.name}
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="right-content">
                  <h4>{product.name}</h4>
                  <span className="price">Rs. {product.price}</span>
                  <ul className="stars">
                    <li><i className="fa fa-star"></i></li>
                    <li><i className="fa fa-star"></i></li>
                    <li><i className="fa fa-star"></i></li>
                    <li><i className="fa fa-star"></i></li>
                    <li><i className="fa fa-star"></i></li>
                  </ul>
                  <span>{product.description}</span>
                  <div className="quote">
                    <i className="fa fa-quote-left"></i>
                    <p>Category: {product.category}</p>
                  </div>
                  <div className="quantity-content">
                    <div className="left-content">
                      <h6>No. of Orders</h6>
                    </div>
                    <div className="right-content">
                      <div className="quantity buttons_added">
                        <input type="button" value="-" className="minus" onClick={decrease} />
                        <input
                          type="number"
                          value={qty}
                          className="input-text qty text"
                          readOnly
                        />
                        <input type="button" value="+" className="plus" onClick={increase} />
                      </div>
                    </div>
                  </div>
                  <div className="total">
                    <h4>Total: Rs. {totalPrice.toFixed(2)}</h4>
                    <div className="main-border-button">
                      <button
                        className="btn btn-success"
                        onClick={handleAddToCart}
                        style={{ marginRight: "10px" }}
                      >
                        Add to Cart
                      </button>
                      <br /> <br /><br />
                      <Link to="/dashboard">Back To List</Link>
                    </div>
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

export default SingleProduct;
