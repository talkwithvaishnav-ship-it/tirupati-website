import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SiteProvider } from "@/context/SiteContext";
import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "@/pages/HomePage";
import ServiceDetailPage from "@/pages/ServiceDetailPage";
import CityPage from "@/pages/CityPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { AdminDashboardPage } from "@/pages/AdminPage";
import { AboutPage, BlogPage, BlogPostPage, ContactPage, LegalPage, ProductsPage, ServicesPage } from "@/pages/StandardPages";
import { ProjectDetailPage, ProjectsPage } from "@/pages/ProjectsPage";
import "@/App.css";

function AnimatedRoutes() {
  const location = useLocation();
  return <AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22, ease: "easeOut" }}><Routes location={location}><Route path="/" element={<HomePage />} /><Route path="/services" element={<ServicesPage />} /><Route path="/services/:slug" element={<ServiceDetailPage />} /><Route path="/projects" element={<ProjectsPage />} /><Route path="/projects/:slug" element={<ProjectDetailPage />} /><Route path="/products" element={<ProductsPage />} /><Route path="/about" element={<AboutPage />} /><Route path="/resources" element={<Navigate to="/blog" replace />} /><Route path="/blog" element={<BlogPage />} /><Route path="/blog/:slug" element={<BlogPostPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/waterproofing/:citySlug" element={<CityPage />} /><Route path="/privacy-policy" element={<LegalPage type="privacy" />} /><Route path="/terms" element={<LegalPage type="terms" />} /><Route path="/disclaimer" element={<LegalPage type="disclaimer" />} /><Route path="/admin" element={<AdminDashboardPage />} /><Route path="/admin/login" element={<AdminDashboardPage />} /><Route path="*" element={<NotFoundPage />} /></Routes></motion.div></AnimatePresence>;
}

export default function App() {
  return <SiteProvider><BrowserRouter><Layout><AnimatedRoutes /></Layout><Toaster position="top-center" richColors /></BrowserRouter></SiteProvider>;
}
