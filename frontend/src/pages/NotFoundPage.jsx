import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-6xl font-bold mb-6">404</h1>
        <p className="text-lg text-gray-400 mb-6">Page not found. The portal you are looking for may have moved or does not exist.</p>
        <Link to="/" className="rounded-full bg-yellow-300 px-8 py-4 text-black font-semibold">Return to Holdings</Link>
      </div>
    </div>
  );
}
