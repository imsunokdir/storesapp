import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

const Header = () => {
  const { user, setUser, isAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await logout();
      if (res.status === 200) {
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      console.log("logout error:", error);
      alert("error logging out");
    }
  };

  return (
    <header className="bg-gray-100 shadow-md p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/" className="text-xl font-semibold text-gray-800">
            Home
          </Link>
        </div>

        <div>
          {!user ? (
            <>
              <Link
                to="/login"
                className="mr-4 text-blue-600 hover:underline font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <span className="mr-6 text-gray-700 font-medium">
                Hi, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
