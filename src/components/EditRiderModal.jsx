import { useState } from "react";
import apiClient from "../services/apiClient";

export default function EditRiderModal({ rider, mode = "recruiter", onClose, onSuccess }) {
  const isDeployed = mode === "deployed";

  const [form, setForm] = useState(
    isDeployed
      ? {
          city: rider.city || "",
          bikeRegistration: rider.bikeRegistration || "",
          status: rider.status || ""
        }
      : {
          fullName: rider.fullName || "",
          email: rider.email || "",
          phoneNumber: rider.phoneNumber || "",
          city: rider.city || "",
          nationality: rider.nationality || "",
          status: rider.status || ""
        }
  );

  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const endpoint = isDeployed
      ? `/recruitment/deployments/${rider.id}`
      : `/recruiter/riders/${rider.id}`;

    await apiClient.put(endpoint, form);

    setLoading(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">
              {isDeployed ? "Edit Deployed Rider" : "Edit Rider"}
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="row g-3">

              {!isDeployed && (
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input name="fullName" className="form-control" value={form.fullName} onChange={handleChange} />
                </div>
              )}

              {!isDeployed && (
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input name="email" className="form-control" value={form.email} onChange={handleChange} />
                </div>
              )}

              {!isDeployed && (
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input name="phoneNumber" className="form-control" value={form.phoneNumber} onChange={handleChange} />
                </div>
              )}

              <div className="col-md-6">
                <label className="form-label">City</label>
                <input name="city" className="form-control" value={form.city} onChange={handleChange} />
              </div>

              {!isDeployed && (
                <div className="col-md-6">
                  <label className="form-label">Nationality</label>
                  <input name="nationality" className="form-control" value={form.nationality} onChange={handleChange} />
                </div>
              )}

              {isDeployed && (
                <div className="col-md-6">
                  <label className="form-label">Bike Registration</label>
                  <input name="bikeRegistration" className="form-control" value={form.bikeRegistration} onChange={handleChange} />
                </div>
              )}

              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Deployed">Deployed</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}