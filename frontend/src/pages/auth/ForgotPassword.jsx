import { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/api/v1/auth/forgot-password', { email });
      setSuccess('If that email exists, a reset link has been sent.');
    } catch (err) {
      setError('Unable to send reset link right now.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl bg-[#111111] p-10 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6">Forgot Password</h1>
        {success && <p className="mb-4 text-sm text-emerald-400">{success}</p>}
        {error && <p className="mb-4 text-sm text-rose-400">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-gray-300">
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D0D0D] p-3 text-white" />
          </label>
          <button type="submit" className="w-full rounded-full bg-yellow-300 py-3 text-black font-semibold hover:bg-yellow-400">Send reset link</button>
        </form>
      </div>
    </div>
  );
}
