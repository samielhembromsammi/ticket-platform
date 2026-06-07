import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oops! Page not found.</p>
      <Link href="/">
        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer">
          Go Back Home
        </button>
      </Link>
    </div>
  );
}
