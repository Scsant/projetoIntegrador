import { Link } from 'react-router';
import { ArrowLeft, Home } from 'lucide-react';

interface QuickNavProps {
  backTo?: string;
  backLabel?: string;
  showHome?: boolean;
}

export function QuickNav({ backTo = '/', backLabel = 'Voltar', showHome = true }: QuickNavProps) {
  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
      <Link
        to={backTo}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">{backLabel}</span>
      </Link>
      
      {showHome && backTo !== '/' && (
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          title="Ir para página inicial"
        >
          <Home className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
