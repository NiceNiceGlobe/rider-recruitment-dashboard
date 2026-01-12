export default function Sidebar({
  activeView,
  setActiveView,
  myTasksToday = 0,
  myTasksWeek = 0,
  isOpen,
}) {
  return (
    <div className={`sidebar ${isOpen ? "show" : ""}`}>
      <div className="p-3 border-bottom">
        <h6 className="mb-0 text-muted">QUICK LINKS</h6>
      </div>

      <ul className="sidebar-menu">
        <li>
          <a
            href="#"
            className={activeView === "dashboard" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setActiveView("dashboard");
            }}
          >
            <i className="bi bi-speedometer2"></i>
            Dashboard
          </a>
        </li>

        <li>
          <a
            href="#"
            className={activeView === "bookings" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setActiveView("bookings");
            }}
          >
            <i className="bi bi-calendar-check"></i>
            Booking Management
          </a>
        </li>

        <li>
          <a
            href="#"
            className={activeView === "riders" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setActiveView("riders");
            }}
          >
            <i className="bi bi-people"></i>
            Riders List
          </a>
        </li>

        <li>
          <a
            href="#"
            className={activeView === "deployed" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setActiveView("deployed");
            }}
          >
            <i className="bi bi-check-circle"></i>
            Deployed Riders
          </a>
        </li>
      </ul>

      <div className="p-3 border-top">
        <h6 className="mb-2 text-muted">ASSIGNED TO ME</h6>

        <div className="d-flex align-items-center mb-2">
          <div
            className="bg-primary rounded-circle me-2"
            style={{ width: 10, height: 10 }}
          />
          <small>Today: {myTasksToday}</small>
        </div>

        <div className="d-flex align-items-center">
          <div
            className="bg-warning rounded-circle me-2"
            style={{ width: 10, height: 10 }}
          />
          <small>This Week: {myTasksWeek}</small>
        </div>
      </div>
    </div>
  );
}