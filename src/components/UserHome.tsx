"use client";

import Image from "next/image";
import Link from "next/link";

export default function UserHome() {
    return (
        <div className="min-h-screen bg-white p-6">

            {/* NAVBAR */}
            <header className="flex items-center justify-between bg-green-900 text-white p-4 rounded-xl shadow">
                <div className="text-3xl font-bold">WarriorHub</div>

                <nav className="flex space-x-6 text-lg">
                    <Link href="/student/home" className="hover:underline">Home</Link>
                    <Link href="/student/events" className="hover:underline">Events</Link>
                    <Link href="/student/profile" className="hover:underline">Profile</Link>
                    <Link href="/student/settings" className="hover:underline">Settings</Link>
                </nav>
            </header>

            {/* GREETING */}
            <h2 className="text-3xl font-semibold mt-6">Aloha, (Student Name!)</h2>

            {/* MAIN GRID */}
            <div className="grid grid-cols-3 gap-6 mt-10">

                {/* EVENTS THIS WEEK */}
                <div>
                    <h3 className="text-xl font-bold">Events this week:</h3>

                    <div className="mt-4 space-y-6">

                        <div className="border rounded-2xl shadow p-2 w-64">
                            <Image
                                src="/hula/image (4).png"
                                width={250}
                                height={150}
                                alt="Hula Show"
                                className="rounded-xl"
                            />
                            <h4 className="font-semibold mt-2">Hula Show at Manoa Campus</h4>
                            <p>November 20th at 1:00 PM</p>

                            <button className="mt-2 bg-green-800 text-white px-4 py-2 rounded-xl">
                                RSVP
                            </button>
                        </div>

                        <div className="border rounded-2xl shadow p-2 w-64">
                            <Image
                                src="/jobfair/image (2).png"
                                width={250}
                                height={150}
                                alt="Job Fair"
                                className="rounded-xl"
                            />
                            <h4 className="font-semibold mt-2">Job Fair at Campus Center</h4>
                            <p>December 1st at 3:00 PM</p>

                            <button className="mt-2 bg-green-800 text-white px-4 py-2 rounded-xl">
                                RSVP
                            </button>
                        </div>

                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold">RSVPS:</h3>
                    <p className="text-gray-500 mt-2">No RSVPs yet.</p>
                </div>

                <div>
                    <h3 className="text-xl font-bold">Favorites:</h3>

                    <div className="mt-4 border p-4 rounded-xl shadow w-64">

                        <h4 className="font-semibold">Event Type</h4>
                        <div className="flex flex-col mt-2 space-y-1">
                            <label><input type="checkbox" /> Cultural</label>
                            <label><input type="checkbox" /> Educational</label>
                            <label><input type="checkbox" /> Residence Halls</label>
                            <label><input type="checkbox" /> Social</label>
                            <label><input type="checkbox" /> Sports</label>
                            <label><input type="checkbox" /> Wellness</label>
                        </div>

                        <h4 className="font-semibold mt-4">Date Range</h4>
                        <input type="date" className="border rounded p-1 w-full"/>

                        <h4 className="font-semibold mt-4">Location</h4>
                        <input
                            type="text"
                            className="border rounded p-1 w-full"
                            placeholder="Enter location"
                        />
                    </div>
                </div>
            </div>

            {/* FOOTER LOGO */}
            <footer className="mt-10 flex justify-center">
                <Image
                    src="/uh logo/image (3).png"
                    width={150}
                    height={150}
                    alt="UH Logo"
                />
            </footer>
        </div>
    );
}

