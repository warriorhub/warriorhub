'use client';

import Link from 'next/link';

export default function OrganizerPage() {
  return (
    <main className="container py-5">

      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">Organizer Dashboard</h1>
        <p className="text-muted">Manage events, RSVPs, and organizer tools.</p>
      </div>

      <div className="row g-4">

        {/* Create Event */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title mb-3">Create Event</h5>
              <p className="card-text text-muted">Add a new event.</p>
              <Link href="/myevents/add" className="btn btn-success">Go →</Link>
            </div>
          </div>
        </div>

        {/* Manage Events */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title mb-3">Manage Events</h5>
              <p className="card-text text-muted">View or edit your events.</p>
              <Link href="/myevents" className="btn btn-success">Go →</Link>
            </div>
          </div>
        </div>

        {/* View RSVPs – placeholder */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title mb-3">View RSVPs</h5>
              <p className="card-text text-muted">Feature coming soon.</p>
              <button type="button" className="btn btn-secondary" disabled>Coming Soon</button>
            </div>
          </div>
        </div>

        {/* Profile – placeholder */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title mb-3">Profile</h5>
              <p className="card-text text-muted">Manage your organizer settings.</p>
              <button type="button" className="btn btn-secondary" disabled>Coming Soon</button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
