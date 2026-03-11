import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


function Login() {
 
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
      login(data.token, data.user?.role);  
      navigate("/");
    } else {
      alert("Invalid credentials");
    }

    //alert(data.message);
  };

  return (
<div className="subscribe">
        <div className="container">
            <div className="row">
                <div className="col-lg-8">
                    <div className="section-heading">
                        <h2>Login</h2>
                    </div>
                    <form id="subscribe" onSubmit={handleSubmit}>
                              

                        <div className="row">
                          
                          <div className="col-lg-5">
                            <fieldset>
                              <input name="email" type="text" id="email" pattern="[^ @]*@[^ @]*" placeholder="Your Email Address" required onChange={handleChange}></input>
                            </fieldset>
                          </div>

                          <div className="col-lg-5">
                            <fieldset>
                              <input name="password" type="password" id="name" placeholder="Password" required onChange={handleChange}></input>
                            </fieldset>
                          </div>
                          <div className="col-lg-2">
                            <fieldset>
                              <button type="submit" id="form-submit" className="main-dark-button"><i className="fa fa-paper-plane"></i></button>
                            </fieldset>
                          </div>
                        </div>
                    </form>
                </div>
                </div></div></div>

  );
}

export default Login;