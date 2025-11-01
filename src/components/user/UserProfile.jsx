import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const UserProfile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:3001/users/${user.id}`)
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, [user]);

  if (!userData) return <p className="text-center mt-8">Loading profile...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
        User Profile
      </h2>

      <div className="space-y-3 text-gray-700">
        <p>
          <strong>Name:</strong> {userData.name}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Role:</strong> {userData.role}
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/user/profile/edit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          ✏️ Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;
