import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import apiClient from "../services/apiClient";
import BookingsPage from "../pages/BookingsPage";
import RidersListPage from "../pages/RidersListPage";
import DeployedRidersPage from "../pages/DeployedRidersPage";
import DeployRiderModal from "../components/DeployRiderModal";
import EditRiderModal from "../components/EditRiderModal";

export default function RiderDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");

  const [stats, setStats] = useState(null);
  const [cities, setCities] = useState([]);
  const [riders, setRiders] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [showAllCities, setShowAllCities] = useState(false);

  const [openActionId, setOpenActionId] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);

  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    apiClient.get("/recruitment/dashboard")
      .then(res => setStats(res.data))
      .catch(() => setStats(null));

    apiClient.get("/recruitment/cities")
      .then(res => setCities(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCities([]));
  }, []);

  const fetchRiders = () => {
    apiClient.get("/recruitment/riders", {
      params: {
        page,
        pageSize,
        search,
        ...(status !== "All" && { status })
      }
    })
    .then(res => {
      setRiders(Array.isArray(res.data?.riders) ? res.data.riders : []);
      setTotalCount(res.data?.totalCount ?? 0);
    })
    .catch(() => {
      setRiders([]);
      setTotalCount(0);
    });
  };

  useEffect(() => {
    fetchRiders();
  }, [page, pageSize, search, status]);

  const maxCityCount = cities.length > 0 ? Math.max(...cities.map(c => c.count)) : 1;
  const sortedCities = [...cities].sort((a, b) => b.count - a.count);
  const displayedCities = showAllCities ? sortedCities : sortedCities.slice(0, 5);
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleView = rider => {
    setSelectedRider(rider);
    setOpenActionId(rider.id);
  };

  const handleCloseActions = () => {
    setOpenActionId(null);
    setSelectedRider(null);
  };

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <Sidebar
        isOpen={sidebarOpen}
        activeView={activeView}
        setActiveView={setActiveView}
        myTasksToday={0}
        myTasksWeek={0}
      />

      <main className="main-content">
        {activeView === "dashboard" && (
          <>
            <div className="row mb-4">
              <div className="col-12">
                <div className="card dashboard-card">
                  <div className="card-body">
                    <h5 className="card-title mb-4">
                      <i className="bi bi-speedometer2 me-2"></i>
                      Recruitment Insights
                    </h5>

                    <div className="row mb-4">
                      <Stat label="Total Riders" value={stats?.totalRiders ?? 0} />
                      <Stat label="Expected Today" value={stats?.expectedToday ?? 0} />
                      <Stat label="Assisted Today" value={stats?.assistedToday ?? 0} />
                      <Stat label="Remaining Today" value={stats?.remainingToday ?? 0} />
                    </div>

                    <h6 className="mb-3">Deployment Progress by City</h6>

                    <div className="row">
                      {displayedCities.map(item => (
                        <div key={item.city} className="col-md-6 mb-3">
                          <CityProgress city={item.city} count={item.count} max={maxCityCount} />
                        </div>
                      ))}
                    </div>

                    {cities.length > 5 && (
                      <div className="text-center mt-3">
                        <button
                          className="btn btn-sm btn-outline-brand"
                          onClick={() => setShowAllCities(v => !v)}
                        >
                          {showAllCities ? "Show Top 5 Cities" : "View All Cities"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-8">
                <div className="search-container">
                  <i className="bi bi-search"></i>
                  <input
                    className="form-control"
                    placeholder="Search riders by name, email, city, status..."
                    value={search}
                    onChange={e => {
                      setPage(1);
                      setSearch(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="d-flex justify-content-end">
                  <select
                    className="form-select me-2"
                    style={{ maxWidth: 200 }}
                    value={status}
                    onChange={e => {
                      setPage(1);
                      setStatus(e.target.value);
                    }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <button
                    className="btn btn-outline-brand"
                    onClick={() => {
                      setSearch("");
                      setStatus("All");
                      setPage(1);
                    }}
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title mb-4 d-flex align-items-center">
                      <i className="bi bi-people me-2"></i>
                      Rider Management
                      <span className="badge bg-purple text-white ms-2">{totalCount}</span>
                    </h5>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Profile Name</th>
                            <th>Contact Info</th>
                            <th>City</th>
                            <th>Uber</th>
                            <th>Huru</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {riders.length === 0 ? (
                            <tr>
                              <td colSpan="9" className="text-center text-muted">
                                No riders found
                              </td>
                            </tr>
                          ) : (
                            riders.map(r => (
                              <tr key={r.id}>
                                <td>{r.id.slice(0, 8)}</td>
                                <td>{r.fullName}</td>
                                <td>
                                  <div>{r.email}</div>
                                  <small className="text-muted">{r.phoneNumber}</small>
                                </td>
                                <td>{r.city}</td>
                                <td>-</td>
                                <td>-</td>
                                <td>
                                  <span className={`badge ${getStatusBadge(r.status)}`}>
                                    {r.status}
                                  </span>
                                </td>
                                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                                <td style={{ position: "relative" }}>
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleView(r)}
                                  >
                                    View
                                  </button>

                                  {openActionId === r.id && (
                                    <div
                                      className="card"
                                      style={{
                                        position: "absolute",
                                        right: 0,
                                        top: "100%",
                                        zIndex: 10,
                                        minWidth: 160
                                      }}
                                    >
                                      <button
                                        className="btn btn-sm btn-outline-primary w-100 text-start d-flex align-items-center gap-2"
                                        onClick={() => setShowDeployModal(true)}
                                      >
                                        <i className="bi bi-truck"></i>
                                        Deploy
                                      </button>

                                      <button
                                        className="btn btn-sm btn-outline-secondary w-100 text-start d-flex align-items-center gap-2 mt-1"
                                        onClick={() => setShowEditModal(true)}
                                      >
                                        <i className="bi bi-pencil-square"></i>
                                        Edit
                                      </button>

                                      <button
                                        className="btn btn-sm btn-outline-danger w-100 text-start d-flex align-items-center gap-2 mt-1"
                                        onClick={() => setShowDeleteModal(true)}
                                      >
                                        <i className="bi bi-trash"></i>
                                        Delete
                                      </button>

                                      <button
                                        className="btn btn-sm btn-light w-100 text-start d-flex align-items-center gap-2 mt-1"
                                        onClick={handleCloseActions}
                                      >
                                        <i className="bi bi-x-circle"></i>
                                        Cancel
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-muted">
                        Showing {riders.length} of {totalCount} riders
                      </small>

                      <div className="d-flex gap-2">
                        <button className="btn btn-outline-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                          Previous
                        </button>
                        <span className="align-self-center">
                          Page {page} of {totalPages}
                        </span>
                        <button className="btn btn-outline-secondary btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                          Next
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === "bookings" && <BookingsPage />}
        {activeView === "riders" && <RidersListPage />}
        {activeView === "deployed" && <DeployedRidersPage />}
      </main>

      {showDeployModal && selectedRider && (
        <DeployRiderModal
          rider={selectedRider}
          onClose={() => {
            setShowDeployModal(false);
            handleCloseActions();
          }}
          onSuccess={() => {
            fetchRiders();
            setActiveView("deployed");
          }}
        />
      )}

      {showEditModal && selectedRider && (
        <EditRiderModal
          rider={selectedRider}
          onClose={() => {
            setShowEditModal(false);
            handleCloseActions();
          }}
          onSuccess={fetchRiders}
        />
      )}

      {showDeleteModal && selectedRider && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1055 }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Rider</h5>
                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete <strong>{selectedRider.fullName}</strong>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    await apiClient.delete(`/recruiter/riders/${selectedRider.id}`);
                    setShowDeleteModal(false);
                    handleCloseActions();
                    fetchRiders();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div className="col-md-3 col-sm-6 mb-3 text-center">
      <div className="stats-number">{value}</div>
      <div className="stats-label">{label}</div>
    </div>
  );
}

function CityProgress({ city, count, max }) {
  const width = (count / max) * 100;

  return (
    <>
      <div className="d-flex justify-content-between">
        <strong>{city}</strong>
        <small>{count} riders</small>
      </div>
      <div className="progress city-progress">
        <div className="progress-bar" style={{ width: `${width}%` }}></div>
      </div>
    </>
  );
}

function getStatusBadge(status) {
  switch (status) {
    case "Pending":
      return "bg-warning text-dark";
    case "Approved":
      return "bg-success";
    case "Rejected":
      return "bg-danger";
    case "Deployed":
      return "bg-primary";
    case "Suspended":
      return "bg-dark";
    default:
      return "bg-secondary";
  }
}