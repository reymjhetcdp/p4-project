import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const URL = import.meta.env.VITE_REACT_API_URL;

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const { email, password } = form;

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`${URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // store token upon successful login
      const { token, name, email } = data;

      // Store the token
      localStorage.setItem("token", token);

      setIsLoggedIn(true);

      console.log(`Name: ${name}`);
      console.log(`Email: ${email}`);

      //clear errors if user succesfully logged in
      setErrors({});

      alert("Login Successful");
      navigate("/dashboard");
    }
    // login validation
    else {
      if (data.message === "Email do not exist") {
        setErrors({
          email: "Email does not exist",
        });
      }
      if (data.message === "Password is incorrect") {
        setErrors({
          password: "Incorrect password, please try again",
        });
      }
    }
  };

  //stay logged in even when you refresh the page
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      navigate("/dashboard");
    }
  }, []);

  return (
    <>
      <section className="heading">
        <h1>Login</h1>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              className="form-control"
              type="email"
              id="email"
              name="email"
              value={email}
              placeholder="Enter email"
              autoComplete="off"
              onChange={handleChange}
            />
            {errors.email && (
              <label className="error-label">{errors.email}</label>
            )}
            <input
              className="form-control"
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              autoComplete="off"
              onChange={handleChange}
            />
            {errors.password && (
              <label className="error-label">{errors.password}</label>
            )}
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-block">
              Submit
            </button>
          </div>
        </form>
        <ul>
          <li className="italicized">
            <span>Don't have an account?</span>
            <Link to="/register">Register now!</Link>
          </li>
        </ul>
      </section>
    </>
  );
}

export default Login;
