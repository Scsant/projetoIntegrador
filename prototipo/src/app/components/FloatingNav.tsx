import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';

interface FloatingNavProps {
  backTo?: string;
  backLabel?: string;
  showHome?: boolean;
}

export function FloatingNav({ 
  backTo, 
  backLabel = 'Voltar', 
  showHome = true
}: FloatingNavProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {backTo && (
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium hidden sm:inline">{backLabel}</span>
        </Link>
      )}
      
      {showHome && (
        <Link
          to="/"
          className="inline-flex items-center justify-center w-10 h-10 bg-white text-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:bg-gray-50"
          title="Ir para página inicial"
        >
          <Home className="w-5 h-5" />
        </Link>
      )}
    </div>
  );
}