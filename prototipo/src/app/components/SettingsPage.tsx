import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useTheme } from 'next-themes';
import {
  ArrowLeft,
  Bell,
  Camera,
  Check,
  ChevronRight,
  Lock,
  Mail,
  Monitor,
  Moon,
  Palette,
  Save,
  Shield,
  Sun,
  Upload,
  User,
  Smartphone,
} from 'lucide-react';
import { hasSupabaseEnv, supabase, supabaseDefaults } from '../lib/supabase';

const tabs = [
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'notificacoes', label: 'Notificacoes', icon: Bell },
  { id: 'aparencia', label: 'Aparencia', icon: Palette },
  { id: 'seguranca', label: 'Seguranca', icon: Shield },
] as const;

type SettingsTab = typeof tabs[number]['id'];

const defaultProfile = {
  nome: 'Maria Silva',
  email: 'maria.silva@escola.com',
  cargo: 'Coordenadora Pedagogica',
  telefone: '(14) 99999-0000',
  bio: 'Responsavel pela organizacao pedagogica, agenda institucional e acompanhamento da equipe docente.',
};

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>('perfil');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [notifications, setNotifications] = useState({
    emailEventos: true,
    emailAtualizacoes: true,
    lembreteReuniao: true,
    lembreteAntecedencia: '30',
    pushFuturo: false,
    whatsappFuturo: false,
  });
  const [security, setSecurity] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  });
  const [saveMessage, setSaveMessage] = useState('');

  const themeOptions = useMemo(
    () => [
      { id: 'light', label: 'Modo claro', icon: Sun },
      { id: 'dark', label: 'Modo escuro', icon: Moon },
      { id: 'system', label: 'Sistema', icon: Monitor },
    ],
    []
  );

  const userInitials = useMemo(() => {
    const parts = profile.nome.trim().split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'EA';
  }, [profile.nome]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!supabase || !supabaseDefaults.userId) return;

      setIsLoadingProfile(true);

      try {
        const [{ data: userData, error: userError }, { data: professionalData, error: professionalError }] = await Promise.all([
          supabase
            .from('usuarios')
            .select('nome, email, telefone, foto_url')
            .eq('id', supabaseDefaults.userId)
            .maybeSingle(),
          supabase
            .from('perfis_profissionais')
            .select('cargo, observacoes')
            .eq('usuario_id', supabaseDefaults.userId)
            .maybeSingle(),
        ]);

        if (userError) throw userError;
        if (professionalError) throw professionalError;

        if (userData) {
          setProfile((current) => ({
            ...current,
            nome: userData.nome ?? current.nome,
            email: userData.email ?? current.email,
            telefone: userData.telefone ?? current.telefone,
            cargo: professionalData?.cargo ?? current.cargo,
            bio: professionalData?.observacoes ?? current.bio,
          }));

          if (userData.foto_url) {
            setAvatarPreview(userData.foto_url);
          }
        }
      } catch {
        setSaveMessage('Nao consegui carregar o perfil real agora. Mantive os dados do prototipo para nao travar a tela.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    void loadProfile();
  }, []);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setSaveMessage('Nova foto selecionada. Clique em "Upload no Storage" para enviar ao Supabase.');
  };

  const handleAvatarUpload = async () => {
    if (!selectedAvatarFile) {
      setSaveMessage('Escolha uma imagem antes de enviar para o Storage.');
      return;
    }

    if (!supabase || !hasSupabaseEnv) {
      setSaveMessage('Supabase ainda nao configurado no front. A foto ficou apenas na visualizacao local.');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const extension = selectedAvatarFile.name.split('.').pop()?.toLowerCase() || 'jpg';
      const sanitizedBaseName = selectedAvatarFile.name
        .replace(/\.[^.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'avatar';
      const ownerId = supabaseDefaults.userId || 'perfil-temporario';
      const filePath = `${ownerId}/avatar-${Date.now()}-${sanitizedBaseName}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(supabaseDefaults.avatarsBucket)
        .upload(filePath, selectedAvatarFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: selectedAvatarFile.type || undefined,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(supabaseDefaults.avatarsBucket)
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      setAvatarPreview(publicUrl);
      setSelectedAvatarFile(null);

      if (supabaseDefaults.userId) {
        const { error: userUpdateError } = await supabase
          .from('usuarios')
          .update({ foto_url: publicUrl, updated_at: new Date().toISOString() })
          .eq('id', supabaseDefaults.userId);

        if (userUpdateError) throw userUpdateError;
      }

      setSaveMessage('Foto enviada com sucesso para o bucket avatars e renderizada na tela.');
    } catch {
      setSaveMessage('Nao consegui enviar a imagem ao Supabase Storage agora. Confira a policy do bucket e o VITE_SUPABASE_DEFAULT_USER_ID.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = (section: string) => {
    setSaveMessage(`Alteracoes de ${section} salvas localmente no prototipo.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0a0f]">
      <div className="bg-white dark:bg-[#1a101a] border-b border-gray-200 dark:border-pink-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#221420] rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Dashboard
              </Link>
              <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">Configuracoes</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Gerencie seu perfil, alertas, tema e seguranca da conta.</p>
            </div>
            <button
              onClick={() => handleSave('configuracoes')}
              className="px-4 py-2 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Salvar tudo
            </button>
          </div>
          {saveMessage && (
            <div className="mt-4 rounded-xl border border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10 px-4 py-3 text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
              <Check className="w-4 h-4" />
              {saveMessage}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6">
          <aside className="bg-white dark:bg-[#1a101a] rounded-2xl shadow-sm border border-gray-200 dark:border-pink-900/20 p-3 sm:p-4 h-fit">
            <div className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`min-w-[220px] lg:min-w-0 lg:w-full shrink-0 flex items-center justify-between rounded-xl px-4 py-3 transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-fuchsia-950/70 text-blue-600 dark:text-pink-300'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#221420]'
                    }`}
                  >
                    <span className="flex items-center gap-3 font-medium">
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="space-y-6">
            {activeTab === 'perfil' && (
              <section className="bg-white dark:bg-[#1a101a] rounded-2xl shadow-sm border border-gray-200 dark:border-pink-900/20 p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex flex-col items-center lg:items-start gap-4 lg:w-72">
                    <div className="w-32 h-32 rounded-2xl bg-blue-100 dark:bg-fuchsia-950/70 overflow-hidden flex items-center justify-center">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl font-bold text-blue-600 dark:text-pink-400">{userInitials}</span>
                      )}
                    </div>
                    <label className="w-full cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      <span className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#221420] text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2c1a28] transition-colors">
                        <Camera className="w-4 h-4" />
                        Trocar foto
                      </span>
                    </label>
                    <button
                      onClick={handleAvatarUpload}
                      disabled={!selectedAvatarFile || isUploadingAvatar}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-[#1a101a] border border-gray-300 dark:border-pink-900/30 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-[#221420] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="w-4 h-4" />
                      {isUploadingAvatar ? 'Enviando...' : 'Upload no Storage'}
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center lg:text-left">
                      Bucket atual: <span className="font-medium">{supabaseDefaults.avatarsBucket}</span>
                      {isLoadingProfile ? ' · Carregando perfil...' : ''}
                    </p>
                  </div>

                  <div className="flex-1 grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Nome</label>
                      <input value={profile.nome} onChange={(e) => setProfile({ ...profile, nome: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-pink-900/30 rounded-lg bg-white dark:bg-[#221420] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Cargo</label>
                      <input value={profile.cargo} onChange={(e) => setProfile({ ...profile, cargo: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-pink-900/30 rounded-lg bg-white dark:bg-[#221420] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">E-mail</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-pink-900/30 rounded-lg bg-white dark:bg-[#221420] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Telefone</label>
                      <input value={profile.telefone} onChange={(e) => setProfile({ ...profile, telefone: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-pink-900/30 rounded-lg bg-white dark:bg-[#221420] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Bio profissional</label>
                      <textarea rows={4} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-pink-900/30 rounded-lg bg-white dark:bg-[#221420] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none resize-none" />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'notificacoes' && (
              <section className="bg-white dark:bg-[#1a101a] rounded-2xl shadow-sm border border-gray-200 dark:border-pink-900/20 p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notificacoes e alertas</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Aqui fica a base para os emails automaticos e lembretes de reuniao/evento.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-gray-200 dark:border-pink-900/20 p-5 bg-gray-50 dark:bg-[#221420]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Email ao criar ou atualizar evento</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Enviar mensagem automatica para todos os participantes.</p>
                      </div>
                      <button onClick={() => setNotifications({ ...notifications, emailEventos: !notifications.emailEventos })} className={`w-12 h-7 rounded-full transition-colors ${notifications.emailEventos ? 'bg-blue-600 dark:bg-pink-600' : 'bg-gray-300 dark:bg-[#2c1a28]'}`}><span className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${notifications.emailEventos ? 'translate-x-6' : 'translate-x-1'}`}></span></button>
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 dark:border-pink-900/20 p-5 bg-gray-50 dark:bg-[#221420]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Email para atualizacoes importantes</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Mudancas de horario, reagendamentos e cancelamentos.</p>
                      </div>
                      <button onClick={() => setNotifications({ ...notifications, emailAtualizacoes: !notifications.emailAtualizacoes })} className={`w-12 h-7 rounded-full transition-colors ${notifications.emailAtualizacoes ? 'bg-blue-600 dark:bg-pink-600' : 'bg-gray-300 dark:bg-[#2c1a28]'}`}><span className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${notifications.emailAtualizacoes ? 'translate-x-6' : 'translate-x-1'}`}></span></button>
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 dark:border-pink-900/20 p-5 bg-gray-50 dark:bg-[#221420]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Lembrete antes da reuniao</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Disparar alerta proximo do horario do compromisso.</p>
                      </div>
                      <button onClick={() => setNotifications({ ...notifications, lembreteReuniao: !notifications.lembreteReuniao })} className={`w-12 h-7 rounded-full transition-colors ${notifications.lembreteReuniao ? 'bg-blue-600 dark:bg-pink-600' : 'bg-gray-300 dark:bg-[#2c1a28]'}`}><span className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${notifications.lembreteReuniao ? 'translate-x-6' : 'translate-x-1'}`}></span></button>
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 dark:border-pink-900/20 p-5 bg-gray-50 dark:bg-[#221420]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Canais futuros</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Push e WhatsApp preparados para a proxima etapa do produto.</p>
                      </div>
                      <div className="flex gap-2 text-gray-500 dark:text-gray-400">
                        <Smartphone className="w-5 h-5" />
                        <Bell className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="max-w-sm">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Antecedencia do lembrete</label>
                  <select value={notifications.lembreteAntecedencia} onChange={(e) => setNotifications({ ...notifications, lembreteAntecedencia: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-pink-900/30 rounded-lg bg-white dark:bg-[#221420] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none">
                    <option value="15">15 minutos antes</option>
                    <option value="30">30 minutos antes</option>
                    <option value="60">60 minutos antes</option>
                  </select>
                </div>
              </section>
            )}

            {activeTab === 'aparencia' && (
              <section className="bg-white dark:bg-[#1a101a] rounded-2xl shadow-sm border border-gray-200 dark:border-pink-900/20 p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Aparencia</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Escolha como o sistema deve ser exibido para voce.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = theme === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setTheme(option.id)}
                        className={`rounded-2xl border p-5 text-left transition-colors ${isActive ? 'border-blue-600 dark:border-pink-500 bg-blue-50 dark:bg-pink-900/20' : 'border-gray-200 dark:border-pink-900/20 bg-white dark:bg-[#221420] hover:bg-gray-50 dark:hover:bg-[#2c1a28]'}`}
                      >
                        <Icon className={`w-8 h-8 mb-4 ${isActive ? 'text-blue-600 dark:text-pink-400' : 'text-gray-500 dark:text-gray-400'}`} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">{option.label}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{option.id === 'system' ? 'Segue a preferencia do dispositivo.' : 'Aplica imediatamente em todas as telas.'}</p>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {activeTab === 'seguranca' && (
              <section className="bg-white dark:bg-[#1a101a] rounded-2xl shadow-sm border border-gray-200 dark:border-pink-900/20 p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Seguranca</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Preparado para integrar com Supabase Auth na proxima etapa.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Senha atual</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input type="password" value={security.senhaAtual} onChange={(e) => setSecurity({ ...security, senhaAtual: e.target.value })} className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-pink-900/30 rounded-lg bg-white dark:bg-[#221420] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Nova senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input type="password" value={security.novaSenha} onChange={(e) => setSecurity({ ...security, novaSenha: e.target.value })} className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-pink-900/30 rounded-lg bg-white dark:bg-[#221420] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Confirmar nova senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input type="password" value={security.confirmarSenha} onChange={(e) => setSecurity({ ...security, confirmarSenha: e.target.value })} className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-pink-900/30 rounded-lg bg-white dark:bg-[#221420] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none" />
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-blue-200 dark:border-pink-900/30 bg-blue-50 dark:bg-fuchsia-950/70 p-4">
                  <p className="text-sm text-blue-700 dark:text-pink-200">Quando ligarmos o Supabase Auth, esta aba vai chamar a redefinicao real de senha e registrar a acao com seguranca.</p>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}



