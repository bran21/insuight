import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-accent/15 to-accent/5 flex items-center justify-center text-6xl mb-8 animate-float border border-accent/10 shadow-xl shadow-accent/5">
        🛸
      </div>
      <h1 className="section-header mb-4">
        404 — Page Not Found
      </h1>
      <p className="text-text-secondary text-sm md:text-base mb-8 max-w-md leading-relaxed">
        The prediction market you are looking for has either been resolved or doesn't exist in this timeline.
      </p>
      <Link to="/" className="btn-primary flex items-center gap-2 text-sm">
        <span>←</span> Return to Dashboard
      </Link>
    </div>
  );
}
