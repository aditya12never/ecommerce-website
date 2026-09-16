import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiMail,
  FiLock,
  FiLogIn,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

import { useAuth } from "../context/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const loginData = {
        email: formData.email.trim(),
        password: formData.password,
      };

      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      const responseText = await response.text();

      let data = {};

      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error(
            "Login response is not valid JSON:",
            parseError
          );

          if (!response.ok) {
            throw new Error(
              responseText ||
                `Login failed. HTTP ${response.status}.`,
              {
                cause: parseError,
              }
            );
          }

          throw new Error(
            "The server returned an invalid login response.",
            {
              cause: parseError,
            }
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            responseText ||
            `Login failed. HTTP ${response.status}.`
        );
      }

      if (!data.token) {
        throw new Error(
          "Login failed because the server did not return an authentication token."
        );
      }

      if (!data.user) {
        throw new Error(
          "Login failed because the server did not return user information."
        );
      }

      console.log(
        "Login successful:",
        data
      );

      login(
        data.user,
        data.token
      );

      setSuccess(
        "Login successful! Redirecting..."
      );

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
          "Unable to login. Please try again."
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          {/* Header */}

          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 text-white">
              <FiLogIn size={28} />
            </div>

            <h1 className="mt-5 text-3xl font-bold text-gray-900">
              Welcome Back
            </h1>

            <p className="mt-2 text-gray-500">
              Login to your ShopZone account.
            </p>
          </div>

          {/* Error */}

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

          {/* Success */}

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

          {/* Form */}

          <form
            onSubmit={handleLogin}
            className="mt-7 space-y-5"
          >

            {/* Email */}

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

            {/* Password */}

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
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-3 focus:ring-gray-900/10"
                />
              </div>
            </div>

            {/* Button */}

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <FiLogIn size={18} />

              {isLoading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          {/* Register */}

          <div className="mt-7 border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="mt-2 inline-block font-semibold text-gray-900 hover:text-gray-500"
            >
              Create a ShopZone Account
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}

export default Login;