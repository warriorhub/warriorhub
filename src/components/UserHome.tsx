'use client';

import Image from "next/image";

export default function UserHome() {
  return (
    <div className="container mt-4">

      {/* TOP LINKS */}
      <div className="d-flex gap-4 mb-2 justify-content-center">
        <p className="fw-semibold m-0 text-dark">Events this week:</p>
        <p className="fw-semibold m-0 text-dark">RSVPS:</p>
        <p className="fw-semibold m-0 text-dark">Favorites:</p>
      </div>

      {/* FEATURED EVENTS TITLE */}
      <h2 className="text-center mb-4 mt-2 text-dark">Featured Events</h2>

      {/* ROW WITH CARDS + FILTER */}
      <div className="row justify-content-center">

        {/* EVENT CARDS */}
        <div className="col-md-6 d-flex flex-row gap-4 justify-content-end">

          {/* CARD 1 */}
          <div className="card" style={{ width: "20rem" }}>
            <Image
              src="/hula/image (4).png"
              width={320}
              height={200}
              className="card-img-top"
              alt="Hula Show"
            />
            <div className="card-body">
              <h5 className="card-title">Hula Show at Manoa Campus</h5>
              <p className="card-text text-muted">
                November 20th at 1:00 PM
              </p>
              <button className="btn btn-success w-100">RSVP</button>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="card" style={{ width: "20rem" }}>
            <Image
              src="/jobfair/image (2).png"
              width={320}
              height={200}
              className="card-img-top"
              alt="Job Fair"
            />
            <div className="card-body">
              <h5 className="card-title">Job Fair at Campus Center</h5>
              <p className="card-text text-muted">
                December 1st at 3:00 PM
              </p>
              <button className="btn btn-success w-100">RSVP</button>
            </div>
          </div>
        </div>

        {/* FILTER PANEL */}
        <div className="col-md-3 offset-md-1">
          <div className="card p-4" style={{ maxWidth: "400px" }}>
            <h5 className="fw-bold">Filter Events</h5>

            <h6 className="mt-3">Event Type</h6>

            <div className="form-check">
              <input className="form-check-input" type="checkbox" />
              <label className="form-check-label">Cultural</label>
            </div>

            <div className="form-check">
              <input className="form-check-input" type="checkbox" />
              <label className="form-check-label">Educational</label>
            </div>

            <div className="form-check">
              <input className="form-check-input" type="checkbox" />
              <label className="form-check-label">Residence Halls</label>
            </div>

            <div className="form-check">
              <input className="form-check-input" type="checkbox" />
              <label className="form-check-label">Social</label>
            </div>

            <div className="form-check">
              <input className="form-check-input" type="checkbox" />
              <label className="form-check-label">Sports</label>
            </div>

            <div className="form-check">
              <input className="form-check-input" type="checkbox" />
              <label className="form-check-label">Wellness</label>
            </div>

            <h6 className="mt-3">Date Range</h6>
            <input type="date" className="form-control" />

            <h6 className="mt-3">Location</h6>
            <input type="text" placeholder="Enter location" className="form-control" />
          </div>
        </div>

      </div>

      {/* RSVPS SECTION */}
      
    </div>
  );
}
