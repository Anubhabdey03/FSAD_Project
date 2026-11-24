import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleBadge = {
  BUYER:  'bg-emerald-100 text-emerald-700',
  SELLER: 'bg-indigo-100 text-indigo-700',
  ADMIN:  'bg-red-100 text-red-700',
};

function NavLink({ to, children }) {
  const { pathname } = useLocation();
  const active = pathname === to || (to !== '/' && pathname.startsWith(to));
  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors px-1 py-0.5 ${
        active ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
      }`}
    >
      {children}
      {active && <div className="h-0.5 bg-indigo-600 rounded-full mt-0.5" />}
    </Link>
  );
}

export default function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo + nav links */}
        <div className="flex items-center gap-7">
          <Link to="/" className="text-lg font-extrabold text-indigo-600 tracking-tight">
            eBaazee
          </Link>

          <div className="hidden sm:flex items-center gap-5">
            {!auth && <NavLink to="/browse">Browse</NavLink>}

            {auth?.role === 'BUYER' && (
              <>
                <NavLink to="/browse">Browse</NavLink>
                <NavLink to="/buyer/bids">My Bids</NavLink>
                <NavLink to="/buyer/purchases">My Purchases</NavLink>
              </>
            )}

            {auth?.role === 'SELLER' && (
              <>
                <NavLink to="/browse">Browse</NavLink>
                <NavLink to="/seller/dashboard">My Listings</NavLink>
                <NavLink to="/seller/products/new">New Listing</NavLink>
              </>
            )}

            {auth?.role === 'ADMIN' && (
              <NavLink to="/admin/dashboard">Dashboard</NavLink>
            )}
          </div>
        </div>

        {/* User section */}
        <div className="flex items-center gap-3">
          {auth ? (
            <>
              <Link to="/profile" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                  {auth.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                    {auth.name}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${roleBadge[auth.role] || 'bg-slate-100 text-slate-600'}`}>
                    {auth.role}
                  </span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg px-3 py-1.5 transition-all cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
