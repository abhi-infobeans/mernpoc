import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddProduct() {


    
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [image, setImage] = useState(null);
    const [notification, setNotification] = useState({ type: "", text: "" });

    const [product, setProduct] = useState({
        name: "",
        price: "",
        quantity: "",
        category: "",
        description: "",
        image: ""
    });

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

        const url = isEdit
            ? `http://localhost:5000/product/${id}`
            : "http://localhost:5000/addproduct";
        const method = isEdit ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            const msg = isEdit ? "Product details updated successfully." : "Product created successfully.";
            navigate("/dashboard", { state: { notification: { type: "success", text: msg } } });
        } else {
            setNotification({ type: "danger", text: data.message || "Unable to save product. Please try again." });
        }
    };
    useEffect(() => {
        if (isEdit) {
            const fetchProduct = async () => {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:5000/product/${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await response.json();
                setProduct(data);
            };
            fetchProduct();
        }
    }, [id]);

    return (
        <div className="container mt-5">
            <div className="subscribe">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="section-heading">
                                <h2>{isEdit ? "Edit Product" : "Add Product"}</h2>
                            </div>

                            {/* notification banner */}
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

                                {isEdit && product.image && (
                                    <div className="mb-3">
                                        <label className="form-label">Current Image</label>
                                        <div>
                                            <img
                                                src={`http://localhost:5000/uploads/${product.image}`}
                                                width="100"
                                                alt="existing"
                                            />
                                        </div>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    className="form-control mb-3"
                                    onChange={handleImage}
                                />
                                <button type="submit" className="btn btn-primary">
                                    {isEdit ? "Update Product" : "Add Product"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default AddProduct;
