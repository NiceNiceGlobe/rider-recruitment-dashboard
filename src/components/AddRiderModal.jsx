import { useState } from "react";
import apiClient from "../services/apiClient";

export default function AddRiderModal({ show, onClose, onSuccess }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    city: "",
    nationality: ""
  });

  const [saving, setSaving] = useState(false);

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Rider</h5>
            <button
              className="btn-close"
              onClick={onClose}
              disabled={saving}
            ></button>
          </div>

          <div className="modal-body">
            <input
              className="form-control mb-2"
              placeholder="Full Name"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              disabled={saving}
            />

            <input
              className="form-control mb-2"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              disabled={saving}
            />

            <input
              className="form-control mb-2"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
              disabled={saving}
            />

            <input
              className="form-control mb-2"
              placeholder="City"
              value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })}
              disabled={saving}
            />

            <input
              className="form-control"
              placeholder="Nationality"
              value={form.nationality}
              onChange={e => setForm({ ...form, nationality: e.target.value })}
              disabled={saving}
            />
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              className="btn btn-brand"
              disabled={saving || !form.fullName}
              onClick={async () => {
                setSaving(true);
                await apiClient.post("/recruiter/add-rider", form);
                setSaving(false);
                onSuccess();
                onClose();
              }}
            >
              {saving ? "Saving..." : "Save Rider"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}