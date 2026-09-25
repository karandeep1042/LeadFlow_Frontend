import {
  LayoutDashboard,
  Users,
  Webhook,
  Zap,
  Kanban,
  CheckSquare,
  Building2,
  FileCheck,
  UploadCloud,
  Sliders,
  Settings,
  Shield,
  FileText,
  BarChart3,
  MessageSquare,
} from 'lucide-react';
import { ROUTES } from '../constants/routes';

export const NAVIGATION_CONFIG = {
  brokerage_admin: [
    {
      subheader: 'Core Workspace',
      items: [
        {
          title: 'Dashboard Overview',
          path: ROUTES.BROKERAGE_ADMIN_DASHBOARD,
          icon: LayoutDashboard,
          badge: null,
        },
        {
          title: 'Advisors & Team',
          path: ROUTES.BROKERAGE_ADMIN_TEAM,
          icon: Users,
          badge: 'Staff',
        },
        {
          title: 'Lead Ingestion (Webhooks)',
          path: ROUTES.BROKERAGE_ADMIN_INTEGRATIONS,
          icon: Webhook,
          badge: 'Live',
        },
        {
          title: 'Email Automations',
          path: ROUTES.BROKERAGE_ADMIN_AUTOMATIONS,
          icon: Zap,
          badge: null,
        },
      ],
    },
    {
      subheader: 'Pipeline & Operations',
      items: [
        {
          title: 'Advisor Kanban Board',
          path: ROUTES.ADVISOR_PIPELINE,
          icon: Kanban,
          badge: null,
        },
        {
          title: 'Pending Tasks',
          path: ROUTES.ADVISOR_TASKS,
          icon: CheckSquare,
          badge: null,
        },
      ],
    },
  ],

  platform_admin: [
    {
      subheader: 'SaaS Tenancy',
      items: [
        {
          title: 'Tenants & Brokerages',
          path: ROUTES.PLATFORM_ADMIN_TENANTS,
          icon: Building2,
          badge: 'Tenants',
        },
        {
          title: 'Platform Analytics',
          path: '#analytics',
          icon: BarChart3,
          badge: null,
        },
        {
          title: 'Global Settings',
          path: ROUTES.PLATFORM_ADMIN_SETTINGS,
          icon: Settings,
          badge: null,
        },
      ],
    },
  ],

  advisor: [
    {
      subheader: 'Mortgage Desk',
      items: [
        {
          title: 'Lead Kanban Pipeline',
          path: ROUTES.ADVISOR_PIPELINE,
          icon: Kanban,
          badge: 'Active',
        },
        {
          title: 'Tasks & Due Diligence',
          path: ROUTES.ADVISOR_TASKS,
          icon: CheckSquare,
          badge: null,
        },
        {
          title: 'Document Inbox',
          path: '#advisor-documents',
          icon: FileText,
          badge: null,
        },
      ],
    },
  ],

  client: [
    {
      subheader: 'Mortgage Application',
      items: [
        {
          title: 'Application Status',
          path: ROUTES.CLIENT_PORTAL,
          icon: FileCheck,
          badge: null,
        },
        {
          title: 'Document Checklist',
          path: ROUTES.CLIENT_DOCUMENTS,
          icon: UploadCloud,
          badge: 'Required',
        },
        {
          title: 'Advisor Messages',
          path: '#client-messages',
          icon: MessageSquare,
          badge: null,
        },
      ],
    },
  ],
};

export const getRoleNavigation = (role) => {
  return NAVIGATION_CONFIG[role] || NAVIGATION_CONFIG.brokerage_admin;
};
