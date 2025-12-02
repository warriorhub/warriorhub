"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function OrganizerHome() {
  const { data: session } = useSession();

  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Organizer Dashboard</h2>

        <span className="text-secondary">
          Welcome, {session?.user?.name || "Organizer"}
        </span>
      </div>

      {/* ACTION BUTTONS */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <Link href="/add" className="btn btn-primary w-100 py-3">
            ➕ Create New Event
          </Link>
        </div>

        <div className="col-md-4 mb-3">
          <Link href="/myevents" className="btn btn-outline-primary w-100 py-3">
            📅 View & Manage My Events
          </Link>
        </div>

        <div className="col-md-4 mb-3">
          <Link href="/calendar" className="btn btn-outline-secondary w-100 py-3">
            🗓 Full Calendar
          </Link>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="row">

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Events</h5>
              <p className="display-6 fw-bold">12</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Upcoming This Week</h5>
              <p className="display-6 fw-bold">4</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Pending Approvals</h5>
              <p className="display-6 fw-bold">1</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
