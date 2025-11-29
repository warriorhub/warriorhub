/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function UserHome() {
  return (
    <div className="container mt-4">

      {/* TOP LINKS */}
      <div className="d-flex gap-4 mb-2 justify-content-center">
        <Link href="/events-this-week" className="fw-semibold m-0 text-dark text-decoration-none">
          Events this week
        </Link>
        <Link href="/rsvps" className="fw-semibold m-0 text-dark text-decoration-none">
          RSVPs
        </Link>
        <Link href="/favorites" className="fw-semibold m-0 text-dark text-decoration-none">
          Favorites
        </Link>
      </div>

      {/* FEATURED EVENTS TITLE */}
      <h2 className="text-center mb-4 mt-2 text-dark">Featured Events</h2>

      {/* ROW WITH CARDS + FILTER */}
      <div className="row justify-content-center">

        {/* EVENT CARDS */}
        <div className="col-md-6 d-flex flex-row gap-4 justify-content-end">

          {/* CARD 1 */}
          <div className="card" style={{ width: '20rem' }}>
            <Image
              src="/hula/image (4).png"
              width={320}
              height={200}
              className="card-img-top"
              alt="Hula Show"
            />
            <div className="card-body">
              <h5 className="card-title">Hula Show at Manoa Campus</h5>
              <p className="card-text text-muted">November 20th at 1:00 PM</p>
              <button type="button" className="btn btn-success w-100">
                RSVP
              </button>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="card" style={{ width: '20rem' }}>
            <Image
              src="/jobfair/image (2).png"
              width={320}
              height={200}
              className="card-img-top"
              alt="Job Fair"
            />
            <div className="card-body">
              <h5 className="card-title">Job Fair at Campus Center</h5>
              <p className="card-text text-muted">December 1st at 3:00 PM</p>
              <button type="button" className="btn btn-success w-100">
                RSVP
              </button>
            </div>
          </div>
        </div>

        {/* FILTER PANEL */}
        <div className="col-md-3 offset-md-1">
          <div className="card p-4" style={{ maxWidth: '400px' }}>
            <h5 className="fw-bold">Filter Events</h5>

            {/* EVENT TYPE CHECKBOXES */}
            <h6 className="mt-3">Event Type</h6>

            {[
              'Cultural',
              'Educational',
              'Residence Halls',
              'Social',
              'Sports',
              'Wellness',
            ].map((labelText) => {
              const id = labelText.toLowerCase().replace(/ /g, '-');
              return (
                <div className="form-check" key={id}>
                  <input className="form-check-input" type="checkbox" id={id} />
                  <label htmlFor={id} className="form-check-label">
                    {labelText}
                  </label>
                </div>
              );
            })}

            <label htmlFor="date-range" className="visually-hidden">Date Range</label>
            <input
              type="date"
              id="date-range"
              aria-label="Date Range"
              className="form-control"
            />

            {/* LOCATION */}
            <label htmlFor="location-input" className="visually-hidden">Location</label>
            <input
              type="text"
              id="location-input"
              placeholder="Enter location"
              aria-label="Location"
              className="form-control"
            />

          </div>
        </div>

      </div>

      {/* RSVPS SECTION */}
      <div className="mt-5">
        <h3 className="text-xl font-bold">RSVPS:</h3>
        <p className="text-gray-500 mt-2">No RSVPs yet.</p>
      </div>

      {/* FAVORITES SECTION */}
      <div className="mt-5">
        <h3 className="text-xl font-bold">Favorites:</h3>

        <div className="mt-4 border p-4 rounded-xl shadow w-64">
          <h4 className="font-semibold">Event Type</h4>
          <div className="flex flex-col mt-2 space-y-1">

            {[
              'Cultural',
              'Educational',
              'Residence Halls',
              'Social',
              'Sports',
              'Wellness',
            ].map((labelText) => {
              const id = labelText.toLowerCase().replace(/ /g, '-fav');
              return (
                <label htmlFor={id} key={id}>
                  <input type="checkbox" id={id} />
                  {' '}
                  {labelText}
                </label>
              );
            })}

          </div>

          <h4 className="font-semibold mt-4">Date Range</h4>
          <input type="date" className="border rounded p-1 w-full" />

          <h4 className="font-semibold mt-4">Location</h4>
          <input
            type="text"
            className="border rounded p-1 w-full"
            placeholder="Enter location"
          />
        </div>
      </div>

      {/* FOOTER LOGO */}
      <footer className="mt-10 flex justify-center">
        <Image
          src="/uhlogo/uhmlogo.png"
          width={150}
          height={150}
          alt="UH Logo"
        />
      </footer>

    </div>
  );
}
