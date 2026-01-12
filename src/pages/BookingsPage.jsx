import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import BookingModal from "../components/BookingModal";

export default function BookingsPage() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    todayBookings: 0,
    upcomingBookings: 0,
    pendingBookings: 0
  });

  const [todayBookings, setTodayBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [search, setSearch] = useState("");

  const [riders, setRiders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    apiClient.get("/recruitment/bookings/dashboard").then(res => {
      setStats({
        totalBookings: res.data.totalBookings ?? 0,
        todayBookings: res.data.todayBookings ?? 0,
        upcomingBookings: res.data.upcomingBookings ?? 0,
        pendingBookings: res.data.pendingBookings ?? 0
      });
    });

    apiClient.get("/recruitment/bookings/today").then(res => {
      setTodayBookings(Array.isArray(res.data) ? res.data : []);
    });

    apiClient.get("/recruitment/bookings/upcoming").then(res => {
      setUpcomingBookings(Array.isArray(res.data) ? res.data : []);
    });

    apiClient.get("/recruitment/bookings/calendar").then(res => {
      setCalendarEvents(
        Array.isArray(res.data)
          ? res.data.map(b => ({
              id: b.id,
              title: b.title,
              start: b.start,
              backgroundColor:
                b.status === "Pending"
                  ? "#ffc107"
                  : b.status === "Confirmed"
                  ? "#28a745"
                  : "#6c757d"
            }))
          : []
      );
    });

    apiClient
      .get("/recruitment/bookings/riders/dropdown")
      .then(res => setRiders(Array.isArray(res.data) ? res.data : []));
  }, []);

  return (
    <>
      <div className="row mb-4">
        <div className="col-12">
          <div className="card dashboard-card">
            <div className="card-body">
              <h5 className="card-title mb-4">
                <i className="bi bi-calendar-check me-2"></i> Booking Management
              </h5>

              <div className="row mb-4">
                <Stat value={stats.totalBookings} label="Total Bookings" />
                <Stat value={stats.todayBookings} label="Today's Bookings" />
                <Stat value={stats.upcomingBookings} label="Upcoming (7 days)" />
                <Stat value={stats.pendingBookings} label="Pending Confirmation" />
              </div>

              <div className="row mb-3">
                <div className="col-md-8">
                  <div className="search-container">
                    <i className="bi bi-search"></i>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search bookings by rider name or ID..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-brand"
                      onClick={() => {
                        setSelectedBooking(null);
                        setShowModal(true);
                      }}
                    >
                      <i className="bi bi-plus-circle me-1"></i> Add Booking
                    </button>
                  </div>
                </div>
              </div>

              <h5 className="mb-3">
                <i className="bi bi-calendar3 me-2"></i> Monthly Booking Calendar
              </h5>

              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay"
                }}
                events={calendarEvents}
                editable
                selectable
                eventClick={info => {
                  setSelectedBooking({ id: info.event.id });
                  setShowModal(true);
                }}
                height="auto"
              />

              <div className="row mt-4">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title mb-3">
                        <i className="bi bi-list-check me-2"></i> Today's Bookings
                        <span className="badge brand-bg ms-2">
                          {todayBookings.length}
                        </span>
                      </h5>

                      {todayBookings.length === 0 ? (
                        <p className="text-muted">No bookings today</p>
                      ) : (
                        todayBookings.map(b => (
                          <BookingItem key={b.id} booking={b} />
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title mb-3">
                        <i className="bi bi-clock-history me-2"></i> Upcoming Bookings
                        <span className="badge brand-bg ms-2">
                          {upcomingBookings.length}
                        </span>
                      </h5>

                      {upcomingBookings.length === 0 ? (
                        <p className="text-muted">No upcoming bookings</p>
                      ) : (
                        upcomingBookings.map(b => (
                          <BookingItem key={b.id} booking={b} />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <BookingModal
        show={showModal}
        onClose={() => setShowModal(false)}
        booking={selectedBooking}
        riders={riders}
        onSave={async form => {
          await apiClient.post("/recruitment/bookings", {
            riderId: form.riderId,
            bookingDate: form.bookingDate,
            bookingTime:
              form.bookingTime.length === 5
                ? `${form.bookingTime}:00`
                : form.bookingTime,
            bookingType: form.bookingType
          });

          setShowModal(false);

          const dashboard = await apiClient.get("/recruitment/bookings/dashboard");
          setStats({
            totalBookings: dashboard.data.totalBookings ?? 0,
            todayBookings: dashboard.data.todayBookings ?? 0,
            upcomingBookings: dashboard.data.upcomingBookings ?? 0,
            pendingBookings: dashboard.data.pendingBookings ?? 0
          });

          const today = await apiClient.get("/recruitment/bookings/today");
          setTodayBookings(today.data);

          const upcoming = await apiClient.get("/recruitment/bookings/upcoming");
          setUpcomingBookings(upcoming.data);

          const calendar = await apiClient.get("/recruitment/bookings/calendar");
          setCalendarEvents(
            calendar.data.map(b => ({
              id: b.id,
              title: b.title,
              start: b.start,
              backgroundColor:
                b.status === "Pending"
                  ? "#ffc107"
                  : b.status === "Confirmed"
                  ? "#28a745"
                  : "#6c757d"
            }))
          );
        }}
      />
    </>
  );
}

function Stat({ value, label }) {
  return (
    <div className="col-md-3 mb-3">
      <div className="text-center">
        <div className="stats-number">{value}</div>
        <div className="stats-label">{label}</div>
      </div>
    </div>
  );
}

function BookingItem({ booking }) {
  return (
    <div className="mb-2">
      <strong>{booking.bookingTime}</strong>{" "}
      {booking.riderName} – {booking.bookingType}
    </div>
  );
}