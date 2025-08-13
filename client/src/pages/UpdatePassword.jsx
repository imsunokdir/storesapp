import React, { useState } from "react";

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation checks
  const isLengthValid = newPassword.length >= 8 && newPassword.length <= 16;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!isLengthValid || !hasUpperCase || !hasSpecialChar) {
      setError(
        "Password must be 8-16 characters, include at least one uppercase letter and one special character"
      );
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with your actual updatePassword API call
      // const res = await updatePassword({ oldPassword: currentPassword, newPassword });
      // if (res.status === 200) { ... }

      // Simulated success response for demonstration:
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Password updated successfully!");
    } catch {
      setError("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Utility to assign color class based on validation
  const getColorClass = (condition) =>
    condition ? "text-green-600" : "text-red-600";

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Update Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium" htmlFor="currentPassword">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="newPassword">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ul className="mt-2 space-y-1 text-sm">
            <li className={getColorClass(isLengthValid)}>
              {isLengthValid ? "✔" : "✘"} 8-16 characters
            </li>
            <li className={getColorClass(hasUpperCase)}>
              {hasUpperCase ? "✔" : "✘"} At least one uppercase letter
            </li>
            <li className={getColorClass(hasSpecialChar)}>
              {hasSpecialChar ? "✔" : "✘"} At least one special character
            </li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {message && (
          <p className="mt-4 text-green-600 text-center">{message}</p>
        )}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default UpdatePassword;
