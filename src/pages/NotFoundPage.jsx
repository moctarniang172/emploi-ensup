import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-semibold text-slate-900 mb-2">Page introuvable</h1>
      <p className="text-slate-500 mb-4">Cette page n'existe pas.</p>
      <Link to="/" className="text-indigo-600 hover:underline">
        Retour à l'accueil
      </Link>
    </div>
  );
}
