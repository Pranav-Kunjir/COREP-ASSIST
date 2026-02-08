"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import { Authenticated, Unauthenticated } from "convex/react";

import SignInForm from "./components/signIn";
import SignOutButton from "./components/signOut";
import Dashboard from "./Pages/Dashboard";
import WorkSpace from "./Pages/WorkSpace";

export default function App() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-light p-4 border-b-2">
        <SignOutButton />
      </header>

      <Authenticated>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspace/:template/:chatId" element={<WorkSpace />} />
        </Routes>
      </Authenticated>

      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>
    </>
  );
}
