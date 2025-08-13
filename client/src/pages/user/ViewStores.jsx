import React, { useContext, useEffect, useState } from "react";
import { getStores } from "../../services/admin";
import { getUserRatings, submitRating } from "../../services/user";
import { AuthContext } from "../../context/AuthContext";
import LoadBalls from "../../components/LoadBalls";
import StoreCard from "../../components/user/StoreCard";
import { useRestoreScroll } from "../../utility/useScrollRestoration";
import { useDispatch } from "react-redux";
import { fetchStoresThunk } from "../../redux/thunk/storeThunks";

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "address", label: "Address" },
  { value: "averageRating", label: "Rating" },
];

const ViewStoresUser = () => {
  useRestoreScroll();
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRatings, setUserRatings] = useState({});
  const { isAuth } = useContext(AuthContext);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

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
      setError("Failed to load stores");
      console.error("Error fetching stores", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRatings = async () => {
    try {
      const res = await getUserRatings();
      const ratingsMap = {};
      res.data.forEach((r) => {
        ratingsMap[r.store.id] = parseFloat(r.rating); // Ensure it's a number
      });
      setUserRatings(ratingsMap);
      console.log("User ratings fetched:", ratingsMap); // Debug log
    } catch (err) {
      console.error("Error fetching user ratings", err);
    }
  };

  const handleRating = async (storeId, newRating) => {
    try {
      const res = await submitRating(storeId, newRating);
      if (res.status === 200) {
        const { avgRating } = res.data;
        // Update user ratings with the new rating
        setUserRatings((prev) => ({
          ...prev,
          [storeId]: parseFloat(newRating),
        }));
        // Update store's average rating
        setStores((prevStores) =>
          prevStores.map((store) =>
            store.id === storeId
              ? { ...store, averageRating: avgRating }
              : store
          )
        );
        console.log("Rating updated successfully", {
          storeId,
          newRating,
          avgRating,
        });
      } else {
        console.warn(`Rating submission failed: ${res.status}`);
      }
    } catch (err) {
      console.error("Error submitting rating", err);
    }
  };

  useEffect(() => {
    if (isAuth) {
      const timeoutId = setTimeout(fetchStores, 300);
      dispatch(
        fetchStoresThunk({
          search,
          sortBy: sortField,
          order: sortOrder.toUpperCase(),
        })
      );
      return () => clearTimeout(timeoutId);
    }
  }, [isAuth, search, sortField, sortOrder]);

  useEffect(() => {
    if (isAuth) fetchUserRatings();
  }, [isAuth]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">All Stores</h2>

        {/* Search and Sort Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    Sort by {label}
                  </option>
                ))}
              </select>

              <button
                onClick={toggleSortOrder}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
                aria-label="Toggle sort order"
                title={`Sort order: ${
                  sortOrder === "asc" ? "Ascending" : "Descending"
                }`}
              >
                {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <LoadBalls />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No stores found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or check back later.
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{stores.length}</span>{" "}
                store{stores.length !== 1 ? "s" : ""}
                {search && (
                  <span>
                    {" "}
                    for "<span className="font-semibold">{search}</span>"
                  </span>
                )}
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {stores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  userRating={userRatings[store.id]}
                  onRatingChange={handleRating}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewStoresUser;
