import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl bg-[#111111] p-10 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6">Login</h1>
        {error && <p className="mb-4 text-sm text-rose-400">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-gray-300">
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D0D0D] p-3 text-white" />
          </label>
          <label className="block text-sm text-gray-300">
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D0D0D] p-3 text-white" />
          </label>
          <button type="submit" disabled={loading} className="auth-submit-btn w-full rounded-full bg-yellow-300 py-3 text-black font-semibold hover:bg-yellow-400">
            {loading ? <span className="btn-loader" aria-label="Loading" /> : 'Sign in'}
          </button>
        </form>
       {/* <p className="mt-6 text-sm text-gray-400">
          Don&apos;t have an account? <Link to="/auth/login" className="text-yellow-300 hover:text-yellow-400">Register</Link>
        </p> */} 
        <p className="mt-2 text-sm text-gray-400">
          <Link to="/auth/forgot-password" className="text-yellow-300 hover:text-yellow-400">Forgot password?</Link>
        </p>
      </div>
    </div>
  );
}
