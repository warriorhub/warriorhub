"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function HomeRouter() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session) {
    redirect("/");
  }

  const role = session.user.role;

  if (role === "USER") redirect("/UserHome");
  if (role === "ORGANIZER") redirect("/organizerhome");
  if (role === "ADMIN") redirect("/admin");

  return <div>Unknown Role</div>;
}

