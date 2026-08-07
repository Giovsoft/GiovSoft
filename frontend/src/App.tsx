import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import CookieConsent from "./components/CookieConsent";
import Analytics from "./components/Analytics";
import SeoManager from "./components/SeoManager";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AboutPage from "./pages/AboutPage";
import AcademyPage from "./pages/AcademyPage";
import ApplicationsPortfolioPage from "./pages/ApplicationsPortfolioPage";
import ContactPage from "./pages/ContactPage";
import CookiesPage from "./pages/CookiesPage";
import LegalNoticePage from "./pages/LegalNoticePage";
import NotFoundPage from "./pages/NotFoundPage";
import PortfolioPage from "./pages/PortfolioPage";
import PrivacyPage from "./pages/PrivacyPage";
import ServicePage from "./pages/ServicePage";
import SoftwarePortfolioPage from "./pages/SoftwarePortfolioPage";
import SolutionsPage from "./pages/SolutionsPage";
import TermsPage from "./pages/TermsPage";
import WebsitePortfolioPage from "./pages/WebsitePortfolioPage";
import Website from "./pages/Website";

const AdminApplications = lazy(() => import("./pages/AdminApplications"));
const AdminBusinessLines = lazy(() => import("./pages/AdminBusinessLines"));
const AdminSales = lazy(() => import("./pages/AdminSales"));
const AdminAudit = lazy(() => import("./pages/AdminAudit"));
const AdminClients = lazy(() => import("./pages/AdminClients"));
const AdminCompanies = lazy(() => import("./pages/AdminCompanies"));
const AdminFollowups = lazy(() => import("./pages/AdminFollowups"));
const AdminPlaceholder = lazy(() => import("./pages/AdminPlaceholder"));
const AdminBilling = lazy(() => import("./pages/AdminBilling"));
const AdminIntegrations = lazy(() => import("./pages/AdminIntegrations"));
const AdminLeadIntelligence = lazy(() => import("./pages/AdminLeadIntelligence"));
const AdminPayments = lazy(() => import("./pages/AdminPayments"));
const AdminProfile = lazy(() => import("./pages/AdminProfile"));
const AdminProjects = lazy(() => import("./pages/AdminProjects"));
const AdminQuotes = lazy(() => import("./pages/AdminQuotes"));
const AdminReceipts = lazy(() => import("./pages/AdminReceipts"));
const AdminRequests = lazy(() => import("./pages/AdminRequests"));
const AdminRoles = lazy(() => import("./pages/AdminRoles"));
const AdminReports = lazy(() => import("./pages/AdminReports"));
const AdminServices = lazy(() => import("./pages/AdminServices"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminSupport = lazy(() => import("./pages/AdminSupport"));
const AdminTickets = lazy(() => import("./pages/AdminTickets"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const ChangePasswordPage = lazy(() => import("./pages/ChangePasswordPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

const isAdminHost =
  typeof window !== "undefined" && window.location.hostname === "admin.giovsoft.com";

function App() {
  return (
    <BrowserRouter>
      <SeoManager />
      <Analytics />
      <Suspense fallback={<div className="route-loading" role="status">Cargando…</div>}>
      <Routes>
        <Route path="/" element={isAdminHost ? <Navigate to="/admin" replace /> : <Website />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/academy" element={<AcademyPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/aviso-legal" element={<LegalNoticePage />} />
        <Route path="/privacidad" element={<PrivacyPage />} />
        <Route path="/servicios/:slug" element={<ServicePage />} />
        <Route path="/software" element={<Navigate to="/portafolio/software" replace />} />
        <Route path="/aplicaciones" element={<Navigate to="/portafolio/aplicaciones" replace />} />
        <Route path="/portafolio" element={<PortfolioPage />} />
        <Route path="/portafolio/software" element={<SoftwarePortfolioPage />} />
        <Route path="/portafolio/aplicaciones" element={<ApplicationsPortfolioPage />} />
        <Route path="/portafolio/sitios-web" element={<WebsitePortfolioPage />} />
        <Route path="/portafolio/ecommerce" element={<SolutionsPage type="ecommerce" />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route
          path="/admin/restablecer-contrasena"
          element={
            <ProtectedAdminRoute>
              <ChangePasswordPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/solicitudes"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminRequests />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/clientes"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminClients />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/seguimiento"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminFollowups />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/empresas"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminCompanies />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/inteligencia-comercial"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminLeadIntelligence />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/roles-permisos"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminRoles />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/productos"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminPlaceholder title="Productos" />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/servicios"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminServices />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/aplicaciones"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminApplications />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/lineas-negocio"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminBusinessLines />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/ventas"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminSales />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/proyectos"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminProjects />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/planes"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminPlaceholder title="Planes" />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminPayments />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/facturacion"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminBilling />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/cotizaciones"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminQuotes />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/cotizaciones/nueva"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminQuotes />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/cotizaciones/:quoteId/editar"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminQuotes />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/comprobantes"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminReceipts />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/tickets"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminTickets />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/soporte"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminSupport />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/reportes"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminReports />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/integraciones"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminIntegrations />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/auditoria"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminAudit />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/perfil"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminProfile />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminUsers />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/ajustes"
          element={
            <ProtectedAdminRoute>
              <Layout>
                <AdminSettings />
              </Layout>
            </ProtectedAdminRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Suspense>
      {!isAdminHost && <CookieConsent />}
    </BrowserRouter>
  );
}

export default App;
