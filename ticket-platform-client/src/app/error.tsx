"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="px-10 py-12 text-center w-full">
        <h1 className="text-7xl font-extrabold text-red-600 drop-shadow-sm">
          500
        </h1>

        <h2 className="text-2xl font-semibold mt-4">Something went wrong</h2>
        <p className="text-gray-600 mt-2">
          We encountered an unexpected error. Please try again or return home.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3 w-max mx-auto  ">
          <button
            onClick={reset}
            className="w-max py-3 px-6 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition cursor-pointer"
          >
            Try Again
          </button>

          <Link href="/">
            <span className="w-max block py-3 px-6 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition cursor-pointer">
              Go Back Home
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
