import React, { useState } from "react";
function Register() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: ""
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        alert(data.message);
    };
    return (
        <div className="subscribe">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="section-heading">
                            <h2>Register</h2>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                onChange={handleChange}
                                required
                            />


                            <br /><br />
                            <input
                                type="number"
                                name="phone"
                                placeholder="Phone"
                                onChange={handleChange}
                                required
                            />
                            <br /><br />
                            <input
                                type="text"
                                name="role"
                                placeholder="Role"
                                onChange={handleChange}
                                required
                            />

                            <br /><br />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                required
                            />
                            <br /><br />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                            />
                            <br /><br />
                            <div className="col-lg-4">
                                <fieldset>
                                    <button type="submit" id="form-submit" className="main-dark-button">
                                        <i className="fa fa-paper-plane"></i>
                                    </button>
                                </fieldset>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Register;