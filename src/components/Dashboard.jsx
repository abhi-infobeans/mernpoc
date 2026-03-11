import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { deleteProduct, getProducts, searchProducts } from "../services/productService";

function Dashboard() {

    const [products, setProducts] = useState([]);
    const [notification, setNotification] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.notification) {
            setNotification(location.state.notification);
            // clear state so message doesn't persist on back/refresh
            window.history.replaceState({}, document.title);
        }
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchProducts(searchTerm);
        }, 300); 

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const fetchProducts = async (query = "") => {

        const token = localStorage.getItem("token");
        try {
            const data = query ? await searchProducts(query, token) : await getProducts(token);
            setProducts(data);
        } catch (error) {
            setNotification({ type: "danger", text: error.message || "Failed to fetch products." });
        }
    };

    const handleAddProduct = () => {
        navigate("/addproduct");
    };

    const handleEditProduct = (productId) => {
        navigate(`/editproduct/${productId}`);
    };

    const handleViewProduct = (productId) => {
        navigate(`/singleproduct/${productId}`);
    };

    const handleDeleteProduct = async (productId) => {
        const shouldDelete = window.confirm("Are you sure you want to delete this product?");
        if (!shouldDelete) return;

        try {
            setDeletingId(productId);
            const token = localStorage.getItem("token");
            await deleteProduct(productId, token);
            await fetchProducts(searchTerm);
            setNotification({ type: "success", text: "Product deleted successfully." });
        } catch (error) {
            setNotification({ type: "danger", text: error.message || "Error deleting product." });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        
                <div className="container mt-12">
                    <div className="row">
                        <div className="col-lg-12">
                            
                            <div className="section-heading">
                                <h2>Product List</h2>
                            </div>

                            {notification && (
                                <div className={`alert alert-${notification.type} mt-3`} role="alert">
                                    {notification.text}
                                </div>
                            )}

                            <div className="mb-3">
                                <button className="btn btn-primary" onClick={handleAddProduct}>
                                    Add New Product
                                </button>
                            </div>

                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by ID, name, or category"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <table className="table table-bordered mt-4">
                                <thead className="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Category</th>
                                        <th>Image</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {products.length > 0 ? (
                                        products.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.name}</td>
                                                <td>₹ {item.price}</td>
                                                <td>{item.category}</td>
                                                <td>
                                                    <img
                                                        src={`http://localhost:5000/uploads/${item.image}`}
                                                        width="80"
                                                        alt={item.name}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleViewProduct(item.id)}
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-info btn-sm"
                                                        onClick={() => handleViewProduct(item.id)}
                                                    >
                                                        View
                                                    </button>
                                                    &nbsp;
                                                    <button
                                                        className="btn btn-warning btn-sm ms-2"
                                                        onClick={() => handleEditProduct(item.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                     &nbsp;
                                                    <button
                                                        className="btn btn-danger btn-sm ms-2"
                                                        onClick={() => handleDeleteProduct(item.id)}
                                                        disabled={deletingId === item.id}
                                                    >
                                                        {deletingId === item.id ? "Deleting..." : "Delete"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">
                                                {searchTerm ? "No matching products found" : "No Products Found"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            
    );
}

export default Dashboard;
