import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notification, setNotification] = useState({ type: "", text: "" });

    const [product, setProduct] = useState({
        name: "",
        price: "",
        quantity: "",
        category: "",
        description: ""
    });
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/product/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        setProduct(data);
    };

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const handleImage = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("price", product.price);
        formData.append("quantity", product.quantity);
        formData.append("category", product.category);
        formData.append("description", product.description);
        if (image) formData.append("image", image);

        const response = await fetch(`http://localhost:5000/product/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });
        const data = await response.json();
        if (response.ok) {
            navigate("/dashboard", { state: { notification: { type: "success", text: "Product updated successfully" } } });
        } else {
            setNotification({ type: "danger", text: data.message || "Error updating product" });
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-lg-8">
                    <div className="section-heading">
                        <h2>Edit Product</h2>
                    </div>

                    {notification.text && (
                        <div className={`alert alert-${notification.type} mt-3`} role="alert">
                            {notification.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="mb-3">
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Product Name"
                                value={product.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="number"
                                name="price"
                                className="form-control"
                                placeholder="Price"
                                value={product.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="number"
                                name="quantity"
                                className="form-control"
                                placeholder="Quantity"
                                value={product.quantity}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="text"
                                name="category"
                                className="form-control"
                                placeholder="Category"
                                value={product.category}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <textarea
                                name="description"
                                className="form-control"
                                placeholder="Description"
                                value={product.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Change Image (optional)</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={handleImage}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Update Product
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProduct;
