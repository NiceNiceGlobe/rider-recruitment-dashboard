import { useState } from "react";
import apiClient from "../services/apiClient";

export default function DeployRiderModal({ rider, onClose, onSuccess }) {
  const [bikeRegistration, setBikeRegistration] = useState("");
  const [city, setCity] = useState(rider.city || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    await apiClient.post("/recruitment/deployments/deploy", {
      riderId: rider.id,
      city,
      bikeRegistration
    });

    setLoading(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Deploy Rider</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Rider</label>
              <input className="form-control" value={rider.fullName} disabled />
            </div>

            <div className="mb-3">
              <label className="form-label">City</label>
              <input
                className="form-control"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Bike Registration</label>
              <input
                className="form-control"
                value={bikeRegistration}
                onChange={e => setBikeRegistration(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading || !bikeRegistration}
            >
              {loading ? "Deploying..." : "Deploy"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}