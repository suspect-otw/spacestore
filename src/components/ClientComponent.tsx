"use client";

import { User } from "@supabase/supabase-js";

export default function ClientComponent({ user }: { user: User }) {
  return (
    <div>
      <h1>{user?.role} Dashboard</h1>
      <div>
        {Object.entries(user).map(([key, value]) => (
          <p key={key}>
            <strong>{key}:</strong> {JSON.stringify(value, null, 2)}
          </p>
        ))}
      </div>
    </div>
  );
}