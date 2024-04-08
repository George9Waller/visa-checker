"use client";

import { signOut } from "next-auth/react";

const SignOut = () => (
  <button className="btn" onClick={() => signOut()}>
    Sign Out
  </button>
);

export default SignOut;
