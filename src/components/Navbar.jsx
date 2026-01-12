import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddRiderModal from "./AddRiderModal";

export default function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const [showAddRider, setShowAddRider] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container-fluid">
          <button
            className="btn sidebar-toggle me-2"
            onClick={onToggleSidebar}
            type="button"
          >
            <i className="bi bi-list"></i>
          </button>

          <span className="navbar-brand">
            <i className="bi bi-bicycle me-2"></i>
            Rider Recruitment Dashboard
          </span>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item me-3">
                <button
                  className="nav-link btn btn-link"
                  onClick={() => setShowAddRider(true)}
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Add New Rider
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="btn btn-outline-danger"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <AddRiderModal
        show={showAddRider}
        onClose={() => setShowAddRider(false)}
        onSuccess={() => window.location.reload()}
      />
    </>
  );
}