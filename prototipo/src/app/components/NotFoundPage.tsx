import { Link } from 'react-router';
import { Calendar, Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0f0a0f] dark:to-[#1a101a] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <Calendar className="w-20 h-20 text-blue-600 dark:text-pink-400" />
        </div>

        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Página não encontrada</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Ir para início
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-[#1a101a] text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-pink-900/30 rounded-lg hover:bg-gray-50 dark:hover:bg-[#221420] transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
