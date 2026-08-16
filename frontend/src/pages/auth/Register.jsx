import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(username, email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl bg-[#111111] p-10 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6">Register</h1>
        {error && <p className="mb-4 text-sm text-rose-400">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-gray-300">
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D0D0D] p-3 text-white" />
          </label>
          <label className="block text-sm text-gray-300">
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D0D0D] p-3 text-white" />
          </label>
          <label className="block text-sm text-gray-300">
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D0D0D] p-3 text-white" />
          </label>

          <div className="role-selection mt-2">
            <label className="role-label block text-sm font-semibold mb-2 text-gray-300">I am joining as:</label>
            <div className="role-cards flex gap-4">
              <button
                type="button"
                className={`role-card flex-1 rounded-2xl border p-4 text-left ${role === 'user' ? 'ring-2 ring-yellow-300' : 'border-white/10'}`}
                onClick={() => setRole('user')}
              >
                <div className="role-icon text-2xl">👤</div>
                <div className="role-title font-semibold">Explorer</div>
                <div className="role-desc text-sm text-gray-400">Browse lands, livestock, and fresh produce</div>
              </button>
              <button
                type="button"
                className={`role-card flex-1 rounded-2xl border p-4 text-left ${role === 'farmer' ? 'ring-2 ring-yellow-300' : 'border-white/10'}`}
                onClick={() => setRole('farmer')}
              >
                <div className="role-icon text-2xl">🌾</div>
                <div className="role-title font-semibold">Farmer Partner</div>
                <div className="role-desc text-sm text-gray-400">Partner with DeeFresh for farming contracts</div>
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn w-full rounded-full bg-yellow-300 py-3 text-black font-semibold hover:bg-yellow-400">
            {loading ? <span className="btn-loader" aria-label="Loading" /> : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-400">
          Already have an account? <Link to="/auth/login" className="text-yellow-300 hover:text-yellow-400">Login</Link>
        </p>
      </div>
    </div>
  );
}
