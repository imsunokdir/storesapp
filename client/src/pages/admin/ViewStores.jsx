import React, { useState, useEffect } from "react";
import { getStores } from "../../services/admin";

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "address", label: "Address" },
  { value: "averageRating", label: "Rating" },
];

const ViewStores = () => {
  const [stores, setStores] = useState([]);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStores = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getStores({
        search,
        sortBy: sortField,
        order: sortOrder.toUpperCase(),
      });
      setStores(res.data);
    } catch (err) {
      console.log("store load error:", err);
      setError("Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [sortField, sortOrder, search]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Stores List</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border border-gray-300 rounded mb-3 sm:mb-0 w-full max-w-md"
        />

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="p-3 border border-gray-300 rounded w-full max-w-xs"
        >
          {sortOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              Sort by {label}
            </option>
          ))}
        </select>

        <button
          onClick={toggleSortOrder}
          className="mt-2 sm:mt-0 px-4 py-3 bg-gray-200 rounded hover:bg-gray-300"
          aria-label="Toggle sort order"
          title={`Sort order: ${
            sortOrder === "asc" ? "Ascending" : "Descending"
          }`}
        >
          {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-3 border-b border-gray-300 text-left">Name</th>
              <th className="p-3 border-b border-gray-300 text-left">Email</th>
              <th className="p-3 border-b border-gray-300 text-left">
                Address
              </th>
              <th className="p-3 border-b border-gray-300 text-left">Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  No stores found.
                </td>
              </tr>
            ) : (
              stores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200">{store.name}</td>
                  <td className="p-3 border-b border-gray-200">
                    {store.email}
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    {store.address}
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    {store.averageRating
                      ? Number(store.averageRating).toFixed(2)
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewStores;
