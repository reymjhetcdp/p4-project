import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const URL = import.meta.env.VITE_REACT_API_URL;

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = form;

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  //handle registration submit
  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      // set errors to empty
      setErrors({});

      // check if name is empty or spaces only
      if (!name || name.trim() === "") {
        setErrors((prev) => ({
          ...prev,
          name: "Name is required",
        }));
        return;
      }

      // password validation -> password must be more than 6 characters
      if (password.length < 8 || password.includes(" ")) {
        setErrors((prev) => ({
          ...prev,
          password:
            "Password must be at least 8 characters and should not include spaces",
        }));
        return;
      }

      // check if passwords match
      if (password !== confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrors((prev) => ({
          ...prev,
          email: "Invalid email address",
        }));
        return;
      }

      const response = await fetch(`${URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        alert("Registration Successful");
        navigate("/login");
      } else {
        if (data.message === "Email already exists") {
          setErrors((prev) => ({
            ...prev,
            email: "Email already exists",
          }));
        } else {
          alert("Registration Failed");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="heading">
        <h1>Register</h1>
        <p>Create your account</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              id="name"
              name="name"
              value={name}
              placeholder="Enter name"
              autoComplete="off"
              onChange={handleChange}
            />
            {errors.name && (
              <label className="error-label">{errors.name}</label>
            )}
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
            <input
              className="form-control"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm password"
              autoComplete="off"
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <label className="error-label">{errors.confirmPassword}</label>
            )}
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-block">
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;
