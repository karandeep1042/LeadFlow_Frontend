export const STAGE_META = {
  'New': {
    code: 'Stage 01',
    label: 'Lead Ingestion',
    color: '#2563eb',
    bgColor: '#eff6ff',
    badge: 'Stage 01: Ingestion',
  },
  'Contacted': {
    code: 'Stage 02',
    label: 'Initial Consultation',
    color: '#0891b2',
    bgColor: '#ecfeff',
    badge: 'Stage 02: Consultation',
  },
  'Document Collection': {
    code: 'Stage 03',
    label: 'Document Collection',
    color: '#d97706',
    bgColor: '#fffbeb',
    badge: 'Stage 03: Documents',
  },
  'Bank Submission': {
    code: 'Stage 04',
    label: 'Bank Submission',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    badge: 'Stage 04: Submission',
  },
  'Won': {
    code: 'Stage 05',
    label: 'Loan Offer & Approval',
    color: '#059669',
    bgColor: '#ecfdf5',
    badge: 'Stage 05: Approved',
  },
  'Lost': {
    code: 'Stage 06',
    label: 'Notary & Closing',
    color: '#0d9488',
    bgColor: '#f0fdfa',
    badge: 'Stage 06: Notary & Closing',
  },
};

export const getStageDisplayName = (stageKey) => {
  if (!stageKey) return 'Unknown Stage';
  if (STAGE_META[stageKey]?.label) return STAGE_META[stageKey].label;
  if (stageKey === 'Won') return 'Loan Offer & Approval';
  if (stageKey === 'Lost') return 'Notary & Closing';
  return stageKey;
};

export const getStageFullLabel = (stageKey) => {
  if (!stageKey) return '';
  const meta = STAGE_META[stageKey];
  if (meta?.code && meta?.label) return `${meta.code}: ${meta.label}`;
  return getStageDisplayName(stageKey);
};

export const DEFAULT_STAGE_TEMPLATES = [
  {
    stage: 'New',
    stageLabel: 'Stage 01: Lead Ingestion',
    subject: 'Welcome to {{brokerage_name}} – Your German Mortgage Application',
    body: `Dear {{client_name}},\n\nThank you for reaching out to {{brokerage_name}}. We have received your inquiry for a German mortgage (Finanzierung) of {{loan_amount}} in {{city}}.\n\nYour assigned Mortgage Advisor {{advisor_name}} will review your information and get in touch within 24 hours.\n\nYou can access your personal Client Portal anytime at: {{portal_link}} to begin organizing your documents.\n\nBest regards,\n{{brokerage_name}} Advisory Team`,
    taskTitle: 'Initial qualification call with {{client_name}}',
    taskPriority: 'high',
    taskDueHours: 2,
  },
  {
    stage: 'Contacted',
    stageLabel: 'Stage 02: Initial Consultation',
    subject: 'Your Mortgage Consultation Summary with {{advisor_name}}',
    body: `Dear {{client_name}},\n\nIt was a pleasure speaking with you regarding your property purchase plans. As discussed, German mortgage lenders evaluate your Blue Card / Residence status, net household income, and equity capital (Eigenkapital).\n\nNext step: Please complete your financial profile on our secure portal at {{portal_link}}.\n\nBest regards,\n{{advisor_name}} | {{brokerage_name}}`,
    taskTitle: 'Follow-up on consultation notes & borrower budget',
    taskPriority: 'medium',
    taskDueHours: 24,
  },
  {
    stage: 'Document Collection',
    stageLabel: 'Stage 03: Document Collection',
    subject: 'Action Required: Required German Mortgage Documents for {{client_name}}',
    body: `Dear {{client_name}},\n\nTo prepare your official bank submission (Bankanfrage), German lenders require standard compliance documentation:\n\n1. Last 3 Salary Slips (Gehaltsabrechnungen)\n2. Last Year-End Tax Summary (Lohnsteuerbescheinigung)\n3. SCHUFA Credit Report\n4. Copy of Passport & Residence Permit (Aufenthaltstitel)\n5. Real Estate Expose & Ground Plan (Grundriss)\n\nPlease upload these directly to your secure checklist at: {{portal_link}}.\n\nWarm regards,\n{{brokerage_name}} Document Verification Desk`,
    taskTitle: 'Audit client uploaded documents against German lender checklist',
    taskPriority: 'high',
    taskDueHours: 12,
  },
  {
    stage: 'Bank Submission',
    stageLabel: 'Stage 04: Bank Submission',
    subject: 'Good News: Your Mortgage Application is Submitted to Lenders',
    body: `Dear {{client_name}},\n\nWe are pleased to inform you that your mortgage dossier has been officially dispatched to our German partner banking network (ING, Commerzbank, DSL Bank, Sparkasse).\n\nExpected lender review turnaround is 3-5 business days. We will notify you immediately once official loan terms and interest rate locks (Zinsbindung) are received.\n\nBest regards,\n{{advisor_name}} | {{brokerage_name}}`,
    taskTitle: 'Monitor banking portal for lender underwriter queries & rate locks',
    taskPriority: 'medium',
    taskDueHours: 48,
  },
  {
    stage: 'Won',
    stageLabel: 'Stage 05: Loan Approval & Offer',
    subject: 'Congratulations! Your Mortgage Loan has been Approved',
    body: `Dear {{client_name}},\n\nCongratulations! We have secured final loan approval (Darlehenszusage) from the lender for {{loan_amount}}.\n\nPlease review your loan agreement and financing schedule in your portal at {{portal_link}} before signing.\n\nNext Step: We will coordinate with your Notary (Notariat) for the deed signing.\n\nBest regards,\n{{brokerage_name}}`,
    taskTitle: 'Prepare binding loan agreement (Darlehensvertrag) & dispatch to client',
    taskPriority: 'high',
    taskDueHours: 24,
  },
  {
    stage: 'Lost',
    stageLabel: 'Stage 06: Notary Appointment & Closing',
    subject: 'Notary Appointment Preparation Guide & Closing Checklist',
    body: `Dear {{client_name}},\n\nYour notary appointment (Notartermin) is the final legal step to acquire your property in Germany.\n\nKey checklist items:\n- Valid original Passport & Registration Certificate (Meldebescheinigung)\n- German Tax ID (Steuer-ID)\n- Land charge deed authorization (Grundschuldbestellungsurkunde)\n\nCongratulations on reaching the finish line!\n\nBest regards,\n{{brokerage_name}}`,
    taskTitle: 'Verify Grundschuld land charge registration with notary office',
    taskPriority: 'medium',
    taskDueHours: 72,
  },
];

export const MERGE_TAGS = [
  { tag: '{{client_name}}', label: 'Client Name', sample: 'Rahul Sharma' },
  { tag: '{{client_email}}', label: 'Client Email', sample: 'rahul.sharma@example.com' },
  { tag: '{{user_name}}', label: 'User Name', sample: 'Rahul Sharma' },
  { tag: '{{user_email}}', label: 'User Email', sample: 'rahul.sharma@example.com' },
  { tag: '{{reset_code}}', label: 'Reset Code', sample: '489215' },
  { tag: '{{reset_url}}', label: 'Reset URL', sample: 'https://leadflow.app/auth/reset-password' },
  { tag: '{{temporary_password}}', label: 'Temporary Password', sample: 'Password@123' },
  { tag: '{{advisor_name}}', label: 'Advisor Name', sample: 'Alexander Weber' },
  { tag: '{{advisor_email}}', label: 'Advisor Email', sample: 'advisor@leadflow.de' },
  { tag: '{{advisor_phone}}', label: 'Advisor Phone', sample: '+49 (0) 30 1234 5678' },
  { tag: '{{brokerage_name}}', label: 'Brokerage Name', sample: 'HypoExpat Berlin' },
  { tag: '{{loan_amount}}', label: 'Loan Amount', sample: '€450,000' },
  { tag: '{{city}}', label: 'Property City', sample: 'Berlin' },
  { tag: '{{portal_link}}', label: 'Portal Link', sample: 'https://leadflow.app/client/portal' },
  { tag: '{{login_url}}', label: 'Login URL', sample: 'https://leadflow.app/auth/signin' },
  { tag: '{{vault_link}}', label: 'Document Vault Link', sample: 'https://leadflow.app/client/documents' },
  { tag: '{{reason}}', label: 'Reason / Notes', sample: 'Document update required for bank underwriting' },
  { tag: '{{rejected_docs}}', label: 'Flagged Document List', sample: 'Last 3 Salary Slips, SCHUFA Credit Report' },
  { tag: '{{stage_label}}', label: 'Stage Label', sample: 'Stage 03: Document Collection' },
  { tag: '{{support_email}}', label: 'Support Email', sample: 'support@leadflow.de' },
];
