import React, { useState, useEffect } from "react";
import { getUsers } from "../../services/admin";

const UserLists = () => {
  const [users, setUsers] = useState([]);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        sortBy: sortField,
        order: sortOrder.toUpperCase(),
        page,
        limit: 5,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (roleFilter !== "all") {
        params.role = roleFilter;
      }

      const res = await getUsers(params);
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sortField, sortOrder, search, roleFilter, page]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1); // reset to page 1 when sort changes
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div
      className="p-8 bg-gray-100 min-h-screen max-w-5xl mx-auto flex flex-col"
      style={{ minHeight: "100vh" }}
    >
      <h1 className="text-3xl font-bold mb-6">Users List</h1>
      <div>
        {" "}
        <input
          type="text"
          placeholder="Search by name, email, or address..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="mb-4 p-3 w-full max-w-md border border-gray-300 rounded"
        />
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="mb-6 p-2 border border-gray-300 rounded max-w-xs"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="normal_user">Normal User</option>
          <option value="store_owner">Store Owner</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          <table className="w-full bg-white rounded shadow">
            <thead className="">
              <tr>
                {["name", "email", "address", "role", "averageStoreRating"].map(
                  (field) => (
                    <th
                      key={field}
                      onClick={() => handleSort(field)}
                      className="cursor-pointer p-3 border-b border-gray-300 text-left"
                    >
                      {field === "averageStoreRating"
                        ? "Avg Store Rating"
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                      {sortField === field
                        ? sortOrder === "asc"
                          ? " ↑"
                          : " ↓"
                        : ""}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b border-gray-200">
                      {user.name}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {user.email}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {user.address}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {user.role}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {user.role === "store_owner" && user.averageStoreRating
                        ? Number(user.averageStoreRating).toFixed(2)
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="mt-auto mt-4 flex justify-center space-x-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserLists;
