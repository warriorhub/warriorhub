'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function UserHome() {
  return (
    <div className='container mt-4'>

      {/* TOP LINKS */}
      <div className='d-flex gap-4 mb-2 justify-content-center'>
        <Link href='/events-this-week' className='fw-semibold m-0 text-dark text-decoration-none'>
          Events this week
        </Link>
        <Link href='/rsvps' className='fw-semibold m-0 text-dark text-decoration-none'>
          RSVPs
        </Link>
        <Link href='/favorites' className='fw-semibold m-0 text-dark text-decoration-none'>
          Favorites
        </Link>
      </div>

      {/* FEATURED EVENTS TITLE */}
      <h2 className='text-center mb-4 mt-2 text-dark'>Featured Events</h2>

      {/* ROW WITH CARDS + FILTER */}
      <div className='row justify-content-center'>

        {/* EVENT CARDS */}
        <div className='col-md-6 d-flex flex-row gap-4 justify-content-end'>

          {/* CARD 1 */}
          <div className='card' style={{ width: '20rem' }}>
            <Image
              src='/hula/image (4).png'
              width={320}
              height={200}
              className='card-img-top'
              alt='Hula Show'
            />
            <div className='card-body'>
              <h5 className='card-title'>Hula Show at Manoa Campus</h5>
              <p className='card-text text-muted'>November 20th at 1:00 PM</p>
              <button type='button' className='btn btn-success w-100'>
                RSVP
              </button>
            </div>
          </div>

          {/* CARD 2 */}
          <div className='card' style={{ width: '20rem' }}>
            <Image
              src='/jobfair/image (2).png'
              width={320}
              height={200}
              className='card-img-top'
              alt='Job Fair'
            />
            <div className='card-body'>
              <h5 className='card-title'>Job Fair at Campus Center</h5>
              <p className='card-text text-muted'>December 1st at 3:00 PM</p>
              <button type='button' className='btn btn-success w-100'>
                RSVP
              </button>
            </div>
          </div>
        </div>

        {/* FILTER PANEL */}
        <div className='col-md-3 offset-md-1'>
          <div className='card p-4' style={{ maxWidth: '400px' }}>
            <h5 className='fw-bold'>Filter Events</h5>

            <h6 className='mt-3'>Event Type</h6>

            {[
              'Cultural',
              'Educational',
              'Residence Halls',
              'Social',
              'Sports',
              'Wellness',
            ].map((label) => {
              const id = label.toLowerCase().replace(/ /g, '-');
              return (
                <div className='form-check' key={id}>
                  <input className='form-check-input' type='checkbox' id={id} />
                  <label htmlFor={id} className='form-check-label'>
                    {label}
                  </label>
                </div>
              );
            })}

            {/* DATE RANGE */}
            <h6 className='mt-3'>Date Range</h6>
            <label htmlFor='date-range' className='visually-hidden'>
              Date Range
            </label>
            <input type='date' id='date-range' className='form-control' />

            {/* LOCATION */}
            <h6 className='mt-3'>Location</h6>
            <label htmlFor='location-input' className='visually-hidden'>
              Location
            </label>
            <input
              type='text'
              id='location-input'
              placeholder='Enter location'
              className='form-control'
            />
          </div>
        </div>

      </div>

      {/* RSVPS SECTION */}
      {/* (Safe to leave empty for now) */}
    </div>
  );
}

