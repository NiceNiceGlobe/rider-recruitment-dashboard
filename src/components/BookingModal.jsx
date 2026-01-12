import { useEffect, useState } from "react";

export default function BookingModal({ show, onClose, booking, riders, onSave }) {
  const [form, setForm] = useState({
    riderId: "",
    bookingDate: "",
    bookingTime: "",
    bookingType: "",
    status: "Pending"
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (booking) {
      setForm({
        riderId: booking.riderId,
        bookingDate: booking.bookingDate,
        bookingTime: booking.bookingTime,
        bookingType: booking.bookingType,
        status: booking.status
      });
    }
  }, [booking]);

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {booking ? "Edit Booking" : "Add Booking"}
            </h5>
            <button className="btn-close" onClick={onClose} disabled={saving}></button>
          </div>

          <div className="modal-body">
            <select
              className="form-select mb-2"
              value={form.riderId}
              onChange={e => setForm({ ...form, riderId: e.target.value })}
              disabled={saving}
            >
              <option value="">Select Rider</option>
              {riders.map(r => (
                <option key={r.id} value={r.id}>
                  {r.fullName}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="form-control mb-2"
              value={form.bookingDate}
              onChange={e => setForm({ ...form, bookingDate: e.target.value })}
              disabled={saving}
            />

            <input
              type="time"
              className="form-control mb-2"
              value={form.bookingTime}
              onChange={e => setForm({ ...form, bookingTime: e.target.value })}
              disabled={saving}
            />

            <input
              type="text"
              className="form-control mb-2"
              placeholder="Booking Type"
              value={form.bookingType}
              onChange={e => setForm({ ...form, bookingType: e.target.value })}
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
              disabled={saving}
              onClick={async () => {
                try {
                  setSaving(true);
                  await onSave(form);
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}