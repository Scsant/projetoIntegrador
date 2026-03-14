import { createBrowserRouter } from "react-router";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { RecoverPasswordPage } from "./components/RecoverPasswordPage";
import { ProfileSelectionPage } from "./components/ProfileSelectionPage";
import { DashboardPage } from "./components/DashboardPage";
import { NotFoundPage } from "./components/NotFoundPage";
import { AgendaPage } from "./components/AgendaPage";
import { ProfessorAgendaPage } from "./components/ProfessorAgendaPage";
import { DirecaoPage } from "./components/DirecaoPage";
import { NotificationsPage } from "./components/NotificationsPage";
import { DesignSystemPage } from "./components/DesignSystemPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/recuperar-senha",
    Component: RecoverPasswordPage,
  },
  {
    path: "/selecionar-perfil",
    Component: ProfileSelectionPage,
  },
  {
    path: "/dashboard",
    Component: DashboardPage,
  },
  {
    path: "/dashboard/agenda",
    Component: AgendaPage,
  },
  {
    path: "/dashboard/professor",
    Component: ProfessorAgendaPage,
  },
  {
    path: "/dashboard/direcao",
    Component: DirecaoPage,
  },
  {
    path: "/dashboard/eventos",
    Component: DashboardPage,
  },
  {
    path: "/dashboard/notificacoes",
    Component: NotificationsPage,
  },
  {
    path: "/dashboard/professores",
    Component: DashboardPage,
  },
  {
    path: "/dashboard/configuracoes",
    Component: DashboardPage,
  },
  {
    path: "/design-system",
    Component: DesignSystemPage,
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);