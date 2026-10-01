export const ROUTES = {
  // Public / Auth
  HOME: '/',
  SIGNIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  SET_INITIAL_PASSWORD: '/set-new-password',
  UNAUTHORIZED: '/unauthorized',

  // Platform Admin
  PLATFORM_ADMIN_TENANTS: '/platform-admin/tenants',
  PLATFORM_ADMIN_ANALYTICS: '/platform-admin/analytics',
  PLATFORM_ADMIN_EMAIL_TEMPLATES: '/platform-admin/email-templates',
  PLATFORM_ADMIN_SETTINGS: '/platform-admin/settings',

  // Brokerage Admin
  BROKERAGE_ADMIN_DASHBOARD: '/admin/dashboard',
  BROKERAGE_ADMIN_TEAM: '/admin/team',
  BROKERAGE_ADMIN_INTEGRATIONS: '/admin/integrations',
  BROKERAGE_ADMIN_AUTOMATIONS: '/admin/automations',
  BROKERAGE_ADMIN_CLIENTS: '/admin/clients',

  // Mortgage Advisor
  ADVISOR_PIPELINE: '/advisor/pipeline',
  ADVISOR_TASKS: '/advisor/tasks',
  ADVISOR_DOCUMENTS: '/advisor/documents',

  // Client (Borrower)
  CLIENT_PORTAL: '/client/portal',
  CLIENT_DOCUMENTS: '/client/documents',

  // Universal User Profile
  PROFILE: '/profile',
};

