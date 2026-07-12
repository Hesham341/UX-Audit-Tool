import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { MarketingLayout } from './layouts/MarketingLayout';
import { HomePage } from './pages/HomePage';
import { FeaturesPage } from './pages/FeaturesPage';
import { PricingPage } from './pages/PricingPage';
import { SolutionsPage } from './pages/SolutionsPage';
import { LoginPage } from './pages/LoginPage';
import { NewProjectPage } from './pages/NewProjectPage';
import { AuditPage } from './pages/AuditPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SettingsPage } from './pages/SettingsPage';
import { ClientAuditPage } from './pages/ClientAuditPage';

function DemoAuditPage() {
  return React.createElement(AuditPage, { isDemo: true });
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MarketingLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'features', Component: FeaturesPage },
      { path: 'pricing', Component: PricingPage },
      { path: 'solutions', Component: SolutionsPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/app',
    Component: () => Navigate({ to: '/app/projects', replace: true }),
  },
  {
    path: '/app/projects',
    Component: ProjectsPage,
  },
  {
    path: '/app/new',
    Component: NewProjectPage,
  },
  {
    path: '/app/audit',
    Component: AuditPage,
  },
  {
    path: '/app/demo',
    Component: DemoAuditPage,
  },
  {
    path: '/app/settings',
    Component: SettingsPage,
  },
  {
    path: '/app/client-view',
    Component: ClientAuditPage,
  },
]);
