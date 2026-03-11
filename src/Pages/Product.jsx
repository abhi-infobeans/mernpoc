import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const data = await getProducts(token);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div className="page-heading" id="top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-content">
                <h2>Check Our Products</h2>
                <span>Browse our latest products.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section" id="products">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading">
                <h2>Our Latest Products</h2>
                <span>Check out all of our products.</span>
              </div>
            </div>
          </div>

          {loading && <p>Loading products...</p>}

          {!loading && error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="row">
              {products.length === 0 && (
                <div className="col-lg-12">
                  <p>No products found.</p>
                </div>
              )}

              {products.map((product) => (
                <div className="col-lg-4" key={product.id}>
                  <div className="item">
                    <div className="thumb">
                      <div className="hover-content">
                        <ul>
                          <li>
                            <Link to={`/singleproduct/${product.id}`}>
                              <i className="fa fa-eye"></i>
                            </Link>
                          </li>
                          <li>
                            <Link to={`/singleproduct/${product.id}`}>
                              <i className="fa fa-star"></i>
                            </Link>
                          </li>
                          <li>
                            <Link to={`/singleproduct/${product.id}`}>
                              <i className="fa fa-shopping-cart"></i>
                            </Link>
                          </li>
                        </ul>
                      </div>

                      <img
                        src={`http://localhost:5000/uploads/${product.image}`}
                        alt={product.name}
                      />
                    </div>

                    <div className="down-content">
                      <h4>{product.name}</h4>
                      <span>Rs. {product.price}</span>
                      <ul className="stars">
                        <li><i className="fa fa-star"></i></li>
                        <li><i className="fa fa-star"></i></li>
                        <li><i className="fa fa-star"></i></li>
                        <li><i className="fa fa-star"></i></li>
                        <li><i className="fa fa-star"></i></li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Product;
