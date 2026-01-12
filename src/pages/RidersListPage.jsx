import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import DeployRiderModal from "../components/DeployRiderModal";
import EditRiderModal from "../components/EditRiderModal";

export default function RidersListPage() {
  const [riders, setRiders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [openActionId, setOpenActionId] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);

  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    apiClient
      .get("/recruitment/riders", {
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
  }, [page, pageSize, search, status]);

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
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="search-container">
            <i className="bi bi-search"></i>
            <input
              type="text"
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

      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-4 d-flex align-items-center">
            <i className="bi bi-people me-2"></i>
            Rider List
            <span className="badge bg-purple text-white ms-2">
              {totalCount}
            </span>
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

      {showDeployModal && selectedRider && (
        <DeployRiderModal
          rider={selectedRider}
          onClose={() => {
            setShowDeployModal(false);
            handleCloseActions();
          }}
          onSuccess={() => setPage(1)}
        />
      )}

      {showEditModal && selectedRider && (
        <EditRiderModal
          rider={selectedRider}
          mode="recruiter"
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