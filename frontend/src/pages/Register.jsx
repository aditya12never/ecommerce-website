import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiUser,
  FiMail,
  FiLock,
  FiUserPlus,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // HANDLE INPUT
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // HANDLE REGISTER
  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // CHECK PASSWORD
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // CHECK PASSWORD LENGTH
    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      console.log("Registering user:", userData);

      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      console.log("Registration successful:", data);

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 sm:py-16">

      <div className="mx-auto w-full max-w-md px-4 sm:px-6">

        {/* REGISTER CARD */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          {/* HEADER */}
          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 text-white">
              <FiUserPlus size={28} />
            </div>

            <h1 className="mt-5 text-3xl font-bold text-gray-900">
              Create Account
            </h1>

            <p className="mt-2 text-gray-500">
              Join ShopZone and start shopping.
            </p>

          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

              <FiAlertCircle
                className="mt-0.5 shrink-0 text-red-500"
                size={20}
              />

              <p className="text-sm font-medium text-red-700">
                {error}
              </p>

            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">

              <FiCheckCircle
                className="mt-0.5 shrink-0 text-green-600"
                size={20}
              />

              <p className="text-sm font-medium text-green-700">
                {success}
              </p>

            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={handleRegister}
            className="mt-7 space-y-5"
          >

            {/* NAME */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <div className="relative">

                <FiUser
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-3 focus:ring-gray-900/10"
                />

              </div>

            </div>

            {/* EMAIL */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <div className="relative">

                <FiMail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-3 focus:ring-gray-900/10"
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="relative">

                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-3 focus:ring-gray-900/10"
                />

              </div>

              <p className="mt-2 text-xs text-gray-400">
                Minimum 6 characters.
              </p>

            </div>

            {/* CONFIRM PASSWORD */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Confirm Password
              </label>

              <div className="relative">

                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-3 focus:ring-gray-900/10"
                />

              </div>

            </div>

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >

              <FiUserPlus size={18} />

              {isLoading
                ? "Creating Account..."
                : "Create Account"}

            </button>

          </form>

          {/* LOGIN LINK */}
          <div className="mt-7 border-t border-gray-200 pt-6 text-center">

            <p className="text-sm text-gray-500">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="mt-2 inline-block font-semibold text-gray-900 hover:text-gray-500"
            >
              Login to ShopZone
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Register;