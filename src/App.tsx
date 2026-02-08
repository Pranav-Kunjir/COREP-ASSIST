"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import { Authenticated, Unauthenticated } from "convex/react";

import Landing from "./Pages/Landing";
import SignOutButton from "./components/signOut";
import Dashboard from "./Pages/Dashboard";
import WorkSpace from "./Pages/WorkSpace";

export default function App() {
  return (
    <>
      <SignOutButton />


      <Authenticated>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspace/:template/:chatId" element={<WorkSpace />} />
        </Routes>
      </Authenticated>

      <Unauthenticated>
        <Landing />
      </Unauthenticated>
    </>
  );
}
