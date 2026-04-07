import { Calendar, Bell, Users, ClipboardList, CheckCircle, ArrowRight, Clock, AlertCircle, TrendingUp, LayoutDashboard, BookOpen, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Link } from 'react-router';
import { ThemeToggle } from './ThemeToggle';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0a0f]">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 dark:bg-[#1a101a]/95 backdrop-blur-sm z-50 border-b border-gray-100 dark:border-pink-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-8 h-8 text-blue-600 dark:text-pink-400" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">EscolaAgenda</span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                to="/login"
                className="px-6 py-2 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 transition-colors"
              >
                Acessar Plataforma
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Transforme a gestão escolar com{' '}
                <span className="text-blue-600 dark:text-pink-400">agendas inteligentes</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Automatize reuniões, eventos e atividades pedagógicas. 
                Mais organização, menos trabalho manual para sua equipe educacional.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 transition-colors text-lg font-medium"
              >
                Acessar Plataforma
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-50 dark:from-pink-900/20 to-gray-50 dark:to-[#1a101a] rounded-2xl p-8 shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1771765780945-c788a6ce4b33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjbGFzc3Jvb20lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3Mjg5MzgzOHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Sistema de agenda digital escolar"
                  className="w-full h-auto rounded-xl"
                />
              </div>
              {/* Floating cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -left-4 top-1/4 bg-white dark:bg-[#1a101a] rounded-lg shadow-lg p-4 hidden lg:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Reunião agendada</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Hoje às 14h</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute -right-4 bottom-1/4 bg-white dark:bg-[#1a101a] rounded-lg shadow-lg p-4 hidden lg:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                    <Bell className="w-6 h-6 text-blue-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">3 notificações</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Novos eventos</p>
                  </div>
                </div>
              </motion.div>
              </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#0f0a0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Os desafios da gestão manual
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Coordenadores e professores perdem horas organizando agendas e lidando com conflitos de horários
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <AlertCircle className="w-8 h-8 text-red-500" />,
                title: 'Conflitos de horários',
                description: 'Reuniões marcadas no mesmo horário causam retrabalho e desgaste'
              },
              {
                icon: <Clock className="w-8 h-8 text-orange-500" />,
                title: 'Tempo desperdiçado',
                description: 'Horas gastas com planilhas e comunicação descentralizada'
              },
              {
                icon: <MessageSquare className="w-8 h-8 text-yellow-600" />,
                title: 'Comunicação fragmentada',
                description: 'Informações perdidas entre e-mails, mensagens e avisos físicos'
              }
            ].map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-[#1a101a] rounded-xl p-8 shadow-sm border border-gray-100 dark:border-pink-900/10"
              >
                <div className="mb-4">{problem.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{problem.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{problem.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1769577063771-b83ebe4c4c13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBjYWxlbmRhciUyMHBsYW5uaW5nfGVufDF8fHx8MTc3Mjg5MzgzOHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Agenda automatizada"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Agenda automatizada que{' '}
                <span className="text-blue-600 dark:text-pink-400">trabalha por você</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Nossa plataforma centraliza toda a gestão de eventos escolares em um único lugar,
                com automação inteligente e sincronização em tempo real.
              </p>
              <ul className="space-y-4">
                {[
                  'Detecção automática de conflitos de horários',
                  'Notificações inteligentes para toda equipe',
                  'Integração com calendário escolar institucional',
                  'Histórico completo de todas as atividades'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-200 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#0f0a0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Funcionalidades completas
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Tudo que sua escola precisa para gerenciar agendas com eficiência
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Calendar className="w-10 h-10 text-blue-600 dark:text-pink-400" />,
                title: 'Agenda Inteligente',
                description: 'Sistema que aprende com seus padrões e sugere os melhores horários para eventos'
              },
              {
                icon: <Bell className="w-10 h-10 text-blue-600 dark:text-pink-400" />,
                title: 'Notificações Automáticas',
                description: 'Avisos em tempo real para professores, coordenadores e diretores'
              },
              {
                icon: <LayoutDashboard className="w-10 h-10 text-blue-600 dark:text-pink-400" />,
                title: 'Calendário Escolar',
                description: 'Visão unificada de todos os eventos, feriados e atividades do ano letivo'
              },
              {
                icon: <Users className="w-10 h-10 text-blue-600 dark:text-pink-400" />,
                title: 'Organização de Reuniões',
                description: 'Agende reuniões pedagógicas com verificação automática de disponibilidade'
              },
              {
                icon: <BookOpen className="w-10 h-10 text-blue-600 dark:text-pink-400" />,
                title: 'Gestão Pedagógica',
                description: 'Controle de avaliações, conselhos de classe e eventos educacionais'
              },
              {
                icon: <ClipboardList className="w-10 h-10 text-blue-600 dark:text-pink-400" />,
                title: 'Relatórios Detalhados',
                description: 'Análises e estatísticas sobre o uso da agenda e participação'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-[#1a101a] rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-pink-900/10"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interface Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Interface moderna e intuitiva
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Acesse de qualquer dispositivo com uma experiência otimizada para educadores
            </p>
          </div>

          <div className="space-y-8">
            {/* Calendar Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-[#1a101a] rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-pink-900/10"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-blue-600 dark:text-pink-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Calendário Escolar</h3>
                  <p className="text-gray-600 dark:text-gray-300">Visão mensal completa com todos os eventos</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 dark:from-pink-900/20 to-gray-50 dark:to-[#1a101a] rounded-xl p-8">
                {/* Calendar Mock */}
                <div className="overflow-x-auto pb-2"><div className="grid grid-cols-7 gap-2 mb-4 min-w-[560px]">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2 min-w-[560px]">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 2;
                    const hasEvent = [4, 8, 15, 18, 22, 28].includes(day);
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                          day < 1 || day > 31
                            ? 'bg-transparent text-gray-300'
                            : hasEvent
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'bg-white dark:bg-[#1a101a] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#221420]'
                        } ${day > 0 && day <= 31 ? 'cursor-pointer' : ''}`}
                      >
                        {day > 0 && day <= 31 ? day : ''}
                      </div>
                    );
                  })}
                </div>
                </div>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Teacher's Agenda */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-[#1a101a] rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-pink-900/10"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 dark:bg-emerald-950/60 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-7 h-7 text-green-600 dark:text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Agenda do Professor</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Próximas atividades</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { time: '09:00', title: 'Reunião Pedagógica', type: 'Sala 3' },
                    { time: '14:00', title: 'Conselho de Classe 9º A', type: 'Auditório' },
                    { time: '16:30', title: 'Avaliação Bimestral', type: 'Sala 12' }
                  ].map((event, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-[#221420] border border-transparent dark:border-pink-900/20 rounded-lg">
                      <div className="text-sm font-medium text-blue-600 dark:text-pink-400 min-w-[60px]">{event.time}</div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{event.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Director's Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-[#1a101a] rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-pink-900/10"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/60 rounded-lg flex items-center justify-center">
                    <LayoutDashboard className="w-7 h-7 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Painel da Direção</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Visão geral da escola</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Eventos esta semana', value: '12', icon: <Calendar className="w-5 h-5" />, color: 'blue' },
                    { label: 'Reuniões pendentes', value: '3', icon: <Users className="w-5 h-5" />, color: 'orange' },
                    { label: 'Taxa de participação', value: '94%', icon: <TrendingUp className="w-5 h-5" />, color: 'green' }
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#221420] border border-transparent dark:border-pink-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            stat.color === 'blue'
                              ? 'bg-blue-100 text-blue-600 dark:bg-fuchsia-950/70 dark:text-pink-300'
                              : stat.color === 'orange'
                                ? 'bg-orange-100 text-orange-600 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-green-100 text-green-600 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {stat.icon}
                        </div>
                        <span className="text-gray-700 dark:text-gray-200">{stat.label}</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Benefícios reais para sua instituição
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Transforme a rotina escolar com tecnologia que realmente faz diferença
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle className="w-12 h-12 text-blue-200" />,
                title: 'Organização Escolar',
                description: 'Reduza em até 70% o tempo gasto com planejamento e organização de agendas',
                stat: '70%'
              },
              {
                icon: <MessageSquare className="w-12 h-12 text-blue-200" />,
                title: 'Comunicação Eficiente',
                description: 'Toda equipe informada em tempo real sobre mudanças e novos eventos',
                stat: '100%'
              },
              {
                icon: <BookOpen className="w-12 h-12 text-blue-200" />,
                title: 'Planejamento Pedagógico',
                description: 'Mais tempo para o que importa: a qualidade do ensino e aprendizado',
                stat: '+50%'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
              >
                <div className="mb-4">{benefit.icon}</div>
                <div className="text-5xl font-bold mb-4 text-blue-100">{benefit.stat}</div>
                <h3 className="text-2xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-blue-100 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}


      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Pronto para transformar sua gestão escolar?
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Junte-se a centenas de instituições que já otimizaram sua organização com nossa plataforma
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 transition-colors text-lg font-medium"
            >
              Acessar Plataforma
              <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="text-gray-400 mt-6">
              Sem necessidade de cartão de crédito • Suporte dedicado • Implementação rápida
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-8 h-8 text-blue-500" />
                <span className="text-xl font-semibold text-white">EscolaAgenda</span>
              </div>
              <p className="text-gray-400">
                Transformando a gestão escolar através da tecnologia
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Recursos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutoriais</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Suporte</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 EscolaAgenda. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}








