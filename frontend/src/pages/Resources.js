import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userRole, setUserRole] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentResourceId, setCurrentResourceId] = useState(null);
  const navigate = useNavigate();

  const fetchResources = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/resources", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch resources");
      }

      const data = await response.json();
      setResources(data);

      // Decode the user role from the token
      const token = localStorage.getItem("token");
      const user = JSON.parse(atob(token.split(".")[1]));
      setUserRole(user.role);
    } catch (error) {
      console.error(error.message);
    }
  };

  const addResource = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title || !content) {
      setError("Both title and content are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/resources", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add resource");
      }

      const newResource = await response.json();
      setResources([...resources, newResource]);
      setTitle("");
      setContent("");
      setSuccess("Resource added successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteResource = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/resources/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete resource");
      }

      setResources(resources.filter((resource) => resource._id !== id));
      setSuccess("Resource deleted successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  const enableEditMode = (resource) => {
    setEditMode(true);
    setCurrentResourceId(resource._id);
    setTitle(resource.title);
    setContent(resource.content);
  };

  const updateResource = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title || !content) {
      setError("Both title and content are required");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/resources/${currentResourceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update resource");
      }

      const updatedResource = await response.json();

      setResources(
        resources.map((resource) =>
          resource._id === updatedResource._id ? updatedResource : resource
        )
      );

      setEditMode(false);
      setTitle("");
      setContent("");
      setSuccess("Resource updated successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
  
      // Make API call to the backend to logout
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        // If logout is successful, remove token from localStorage
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("Logout failed:", errorData.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleGoToMyProfile = () => {
    navigate("/profile");
  };

  return (
    <div
      className="container py-5"
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <div className="text-center mb-4">
        <h1>Your Resources</h1>
        <p className="text-muted">Manage your resources easily</p>
      </div>

      <form
        onSubmit={editMode ? updateResource : addResource}
        className="mb-4"
      >
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Resource Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Resource Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="3"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          {editMode ? "Update Resource" : "Add Resource"}
        </button>
        {editMode && (
          <button
            type="button"
            className="btn btn-secondary ms-3"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        )}
      </form>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <ul className="list-group">
        {resources.map((resource) => (
          <li
            key={resource._id}
            className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center mb-2"
          >
            <div>
              <strong>{resource.title}</strong>
              <p className="mb-0">{resource.content}</p>
            </div>
            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => enableEditMode(resource)}
              >
                Edit
              </button>
              {(userRole === "admin" || userRole === "user") && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteResource(resource._id)}
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="text-center mt-4">
  <button
    className="btn btn-secondary me-3" // Add margin-end (me-3) for spacing
    onClick={handleGoToMyProfile}
  >
    Go to My Profile
  </button>
  <button
    onClick={handleLogout}
    className="btn"
    style={{ backgroundColor: "red", color: "white" }} // Inline style for red button
  >
    Logout
  </button>
</div>

    </div>
  );
};

export default Resources;
