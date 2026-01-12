import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import EditRiderModal from "../components/EditRiderModal";

export default function DeployedRidersPage() {
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [search, setSearch] = useState("");

  const [stats, setStats] = useState({
    totalDeployed: 0,
    thisMonth: 0,
    thisWeek: 0,
    deploymentRate: 0
  });

  const [byCity, setByCity] = useState([]);
  const [topCities, setTopCities] = useState([]);
  const [showAllCities, setShowAllCities] = useState(false);

  const [openActionId, setOpenActionId] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    apiClient
      .get("/recruitment/deployments", {
        params: { page, pageSize, search }
      })
      .then(res => {
        setItems(Array.isArray(res.data?.items) ? res.data.items : []);
        setTotalCount(res.data?.totalCount ?? 0);
      })
      .catch(() => {
        setItems([]);
        setTotalCount(0);
      });
  }, [page, pageSize, search]);

  useEffect(() => {
    apiClient.get("/recruitment/deployments/stats").then(res => {
      setStats(res.data);
    });

    apiClient.get("/recruitment/deployments/by-city").then(res => {
      setByCity(res.data);
    });

    apiClient.get("/recruitment/deployments/top-cities").then(res => {
      setTopCities(res.data);
    });
  }, []);

  const totalPages = Math.ceil(totalCount / pageSize);
  const displayedCities = showAllCities ? byCity : byCity.slice(0, 5);

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
      <div className="row mb-4">
        <Stat label="Total Deployed" value={stats.totalDeployed} />
        <Stat label="This Month" value={stats.thisMonth} />
        <Stat label="This Week" value={stats.thisWeek} />
        <Stat label="Deployment Rate" value={`${stats.deploymentRate}%`} />
      </div>

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="search-container">
            <i className="bi bi-search"></i>
            <input
              type="text"
              className="form-control"
              placeholder="Search by rider, city, agent, bike..."
              value={search}
              onChange={e => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h6 className="mb-3">Deployment by City</h6>
              {displayedCities.map(c => (
                <div key={c.city} className="mb-2">
                  <div className="d-flex justify-content-between">
                    <span>{c.city}</span>
                    <span>{c.deployed}</span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar bg-purple"
                      style={{ width: `${Math.min(c.deployed, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              <button
                className="btn btn-link p-0 mt-2"
                onClick={() => setShowAllCities(!showAllCities)}
              >
                {showAllCities ? "View Top 5" : "View All"}
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6 className="mb-3">Top Performing Cities</h6>
              {topCities.map(c => (
                <div key={c.city} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <strong>{c.city}</strong>
                    <span>{c.deployed}</span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar bg-purple"
                      style={{ width: `${Math.min(c.deployed, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-4 d-flex align-items-center">
            <i className="bi bi-truck me-2"></i>
            Deployed Riders
            <span className="badge bg-purple text-white ms-2">
              {totalCount}
            </span>
          </h5>

          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>City</th>
                  <th>Recruiter</th>
                  <th>Deployment Date</th>
                  <th>Bike Registration</th>
                  <th>Agent</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-muted">
                      No deployed riders found
                    </td>
                  </tr>
                ) : (
                  items.map(d => (
                    <tr key={d.id}>
                      <td>{d.id.slice(0, 8)}</td>
                      <td>{d.riderName}</td>
                      <td>{d.city}</td>
                      <td>{d.recruiter}</td>
                      <td>{new Date(d.deploymentDate).toLocaleDateString()}</td>
                      <td>{d.bikeRegistration}</td>
                      <td>{d.agent}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(d.status)}`}>
                          {d.status}
                        </span>
                      </td>
                      <td style={{ position: "relative" }}>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleView(d)}
                        >
                          View
                        </button>

                        {openActionId === d.id && (
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
                              className="btn btn-sm btn-outline-secondary w-100 text-start d-flex align-items-center gap-2"
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
              Showing {items.length} of {totalCount} deployed riders
            </small>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>

              <span className="align-self-center">
                Page {page} of {totalPages}
              </span>

              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && selectedRider && (
        <EditRiderModal
          rider={selectedRider}
          mode="deployed"
          onClose={() => {
            setShowEditModal(false);
            handleCloseActions();
          }}
          onSuccess={() => setPage(1)}
        />
      )}

      {showDeleteModal && selectedRider && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Deployed Rider</h5>
                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete <strong>{selectedRider.riderName}</strong>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    await apiClient.delete(`/recruitment/deployments/${selectedRider.id}`);
                    setShowDeleteModal(false);
                    handleCloseActions();
                    setPage(1);
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

function getStatusBadge(status) {
  switch (status) {
    case "Deployed":
      return "bg-primary";
    case "Active":
      return "bg-success";
    case "Suspended":
      return "bg-dark";
    case "Terminated":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}