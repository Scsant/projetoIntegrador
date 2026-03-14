import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Calendar, BookOpen, Users, LayoutDashboard, ArrowRight, LogOut } from 'lucide-react';

type ProfileType = 'professor' | 'direcao' | 'coordenacao' | null;

export function ProfileSelectionPage() {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<ProfileType>(null);
  const [isLoading, setIsLoading] = useState(false);

  const profiles = [
    {
      id: 'professor' as ProfileType,
      title: 'Professor',
      description: 'Acesse sua agenda de aulas, reuniões e atividades pedagógicas',
      icon: <BookOpen className="w-10 h-10" />,
      color: 'blue',
      features: [
        'Agenda de aulas',
        'Calendário de avaliações',
        'Reuniões pedagógicas'
      ]
    },
    {
      id: 'direcao' as ProfileType,
      title: 'Direção',
      description: 'Visão completa da gestão escolar e eventos institucionais',
      icon: <LayoutDashboard className="w-10 h-10" />,
      color: 'purple',
      features: [
        'Dashboard executivo',
        'Gestão de eventos',
        'Relatórios gerenciais'
      ]
    },
    {
      id: 'coordenacao' as ProfileType,
      title: 'Coordenação',
      description: 'Organize reuniões pedagógicas e acompanhe a equipe',
      icon: <Users className="w-10 h-10" />,
      color: 'green',
      features: [
        'Organização pedagógica',
        'Gestão de equipe',
        'Conselhos de classe'
      ]
    }
  ];

  const handleContinue = () => {
    if (!selectedProfile) return;
    
    setIsLoading(true);
    
    // Simular navegação para dashboard
    setTimeout(() => {
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto pt-6 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">EscolaAgenda</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Selecione seu perfil
          </h1>
          <p className="text-xl text-gray-600">
            Escolha como você deseja acessar a plataforma
          </p>
        </motion.div>

        {/* Profile cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {profiles.map((profile, index) => {
            const isSelected = selectedProfile === profile.id;
            const colorClasses = {
              blue: {
                bg: 'bg-blue-600',
                border: 'border-blue-600',
                text: 'text-blue-600',
                bgLight: 'bg-blue-50',
                hover: 'hover:border-blue-400'
              },
              purple: {
                bg: 'bg-purple-600',
                border: 'border-purple-600',
                text: 'text-purple-600',
                bgLight: 'bg-purple-50',
                hover: 'hover:border-purple-400'
              },
              green: {
                bg: 'bg-green-600',
                border: 'border-green-600',
                text: 'text-green-600',
                bgLight: 'bg-green-50',
                hover: 'hover:border-green-400'
              }
            }[profile.color];

            return (
              <motion.button
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedProfile(profile.id)}
                className={`relative bg-white rounded-2xl p-8 text-left transition-all duration-300 ${
                  isSelected
                    ? `border-2 ${colorClasses.border} shadow-xl`
                    : `border-2 border-gray-200 ${colorClasses.hover} shadow-md hover:shadow-lg`
                }`}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute -top-3 -right-3 w-10 h-10 ${colorClasses.bg} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 ${colorClasses.bgLight} rounded-xl flex items-center justify-center mb-6 ${colorClasses.text}`}>
                  {profile.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{profile.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{profile.description}</p>

                {/* Features */}
                <ul className="space-y-2">
                  {profile.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className={`w-1.5 h-1.5 ${colorClasses.bg} rounded-full`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.button>
            );
          })}
        </div>

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-md mx-auto"
        >
          <button
            onClick={handleContinue}
            disabled={!selectedProfile || isLoading}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Carregando...
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {!selectedProfile && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Selecione um perfil para continuar
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}