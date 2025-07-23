// src/components/Dashboard.tsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold">📚 Book Review Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user?.name}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">My Reviews</h3>
              <p className="text-3xl font-bold text-blue-400">0</p>
              <p className="text-gray-400">Reviews written</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Books Read</h3>
              <p className="text-3xl font-bold text-green-400">0</p>
              <p className="text-gray-400">Books reviewed</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Average Rating</h3>
              <p className="text-3xl font-bold text-yellow-400">0.0</p>
              <p className="text-gray-400">Stars given</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg text-left transition-colors">
                  <h4 className="font-semibold mb-2">Add New Book</h4>
                  <p className="text-gray-300">
                    Add a new book to the platform
                  </p>
                </button>
                <button className="bg-green-600 hover:bg-green-700 p-4 rounded-lg text-left transition-colors">
                  <h4 className="font-semibold mb-2">Write Review</h4>
                  <p className="text-gray-300">Review a book you've read</p>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="bg-gray-700 p-6 rounded-lg">
                <p className="text-gray-400">No recent activity to show.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
