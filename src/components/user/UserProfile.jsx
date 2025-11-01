import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API_URL = "https://ecommercebackend-7avx.onrender.com"; // ✅ Replace localhost for deployment

const UserProfile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  // ✅ Fetch user data
  useEffect(() => {
    if (!user?.id) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/users/${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Could not load your profile. Please try again later.");
      }
    };

    fetchUser();
  }, [user]);

  // ✅ Handle loading
  if (!userData && !error)
    return (
      <p className="text-center mt-10 text-gray-600 text-lg">
        Loading your profile...
      </p>
    );

  // ✅ Handle error
  if (error)
    return (
      <div className="text-center mt-10 text-red-600 font-medium">
        {error}
      </div>
    );

  return (
    <div className="max-w-lg mx-auto pt-24 mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
        👤 User Profile
      </h2>

      {/* Profile Avatar */}
      <div className="flex justify-center mb-6">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            userData.name || "User"
          )}&background=0D8ABC&color=fff`}
          alt="User Avatar"
          className="w-24 h-24 rounded-full shadow-md"
        />
      </div>

      {/* User Details */}
      <div className="space-y-3 text-gray-700 text-center">
        <p>
          <strong>Name:</strong> {userData.name || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {userData.email || "N/A"}
        </p>
        <p>
          <strong>Role:</strong>{" "}
          <span className="capitalize">
            {userData.role || "Customer"}
          </span>
        </p>
      </div>

      {/* Edit Button */}
      <div className="mt-8 text-center">
        <Link
          to="/user/profile/edit"
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          ✏️ Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;
