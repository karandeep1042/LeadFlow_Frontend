/**
 * Authentic German Expat Mortgage Document Checklist Configuration
 */

export const GERMAN_MORTGAGE_CATEGORIES = [
  {
    id: 'personal',
    name: 'Personal & Legal Identification',
    germanTitle: 'Personaldokumente & Aufenthalt',
    description: 'Government IDs, EU Blue Card / German residence permit, and residency registration.',
    badgeColor: 'primary',
  },
  {
    id: 'income',
    name: 'Income & Employment Verification',
    germanTitle: 'Einkommens- & Beschäftigungsnachweise',
    description: 'Last 3 payslips, December tax statement, and permanent employment contract.',
    badgeColor: 'success',
  },
  {
    id: 'financial',
    name: 'Financial Standing & Down Payment Equity',
    germanTitle: 'Eigenkapital- & Bonitätsnachweise',
    description: 'Bank statements, SCHUFA credit report (<60 days), and equity proof.',
    badgeColor: 'warning',
  },
  {
    id: 'property',
    name: 'Target Property & Collateral Exposé',
    germanTitle: 'Objekt- & Immobiliendokumente',
    description: 'Real estate exposé, Land Register extract (Grundbuch), and floor plans.',
    badgeColor: 'secondary',
  },
];

export const CHECKLIST_DEFINITIONS = [
  // Personal
  {
    docType: 'passport',
    category: 'personal',
    title: 'Valid Passport (Reisepass)',
    germanTitle: 'Gültiger Reisepass / ID',
    description: 'Color scan of passport with photo and validity.',
    required: true,
  },
  {
    docType: 'residence_permit',
    category: 'personal',
    title: 'Residence Permit / EU Blue Card',
    germanTitle: 'Aufenthaltstitel / Blaue Karte EU',
    description: 'Front and back scan of your electronic residence permit.',
    required: true,
  },
  {
    docType: 'registration_cert',
    category: 'personal',
    title: 'Registration Certificate (Meldebescheinigung)',
    germanTitle: 'Aktuelle Meldebescheinigung',
    description: 'Residency registration issued by German Bürgeramt.',
    required: true,
  },
  {
    docType: 'marriage_cert',
    category: 'personal',
    title: 'Marriage Certificate (if joint application)',
    germanTitle: 'Heiratsurkunde (bei Ehepaaren)',
    description: 'Certified marriage or civil partnership certificate.',
    required: false,
  },

  // Income
  {
    docType: 'payslip_1',
    category: 'income',
    title: 'Salary Slip 1 (Most Recent)',
    germanTitle: 'Gehaltsabrechnung (Aktueller Monat)',
    description: 'Most recent German salary slip with gross/net income.',
    required: true,
  },
  {
    docType: 'payslip_2',
    category: 'income',
    title: 'Salary Slip 2 (Previous Month)',
    germanTitle: 'Gehaltsabrechnung (Vormonat)',
    description: 'Previous month consecutive salary slip.',
    required: true,
  },
  {
    docType: 'payslip_3',
    category: 'income',
    title: 'Salary Slip 3 (2 Months Ago)',
    germanTitle: 'Gehaltsabrechnung (Vorvormonat)',
    description: 'Third consecutive month salary slip.',
    required: true,
  },
  {
    docType: 'tax_summary',
    category: 'income',
    title: 'December Tax Summary (Lohnsteuerbescheinigung)',
    germanTitle: 'Letzte Lohnsteuerbescheinigung',
    description: 'December annual electronic wage tax summary.',
    required: true,
  },
  {
    docType: 'employment_contract',
    category: 'income',
    title: 'Employment Contract (Arbeitsvertrag)',
    germanTitle: 'Unbefristeter Arbeitsvertrag',
    description: 'Signed employment contract confirming permanent terms.',
    required: true,
  },
  {
    docType: 'employer_confirmation',
    category: 'income',
    title: 'Employer Certificate (Arbeitgeberbestätigung)',
    germanTitle: 'Aktuelle Arbeitgeberbestätigung',
    description: 'HR certificate confirming active employment status.',
    required: false,
  },

  // Financial
  {
    docType: 'schufa',
    category: 'financial',
    title: 'SCHUFA Credit Report (Bonitätsauskunft)',
    germanTitle: 'Aktuelle SCHUFA-Bonitätsauskunft',
    description: 'Official SCHUFA report dated within the last 60 days.',
    required: true,
  },
  {
    docType: 'bank_statement_1',
    category: 'financial',
    title: 'Bank Statement 1 (Checking Account)',
    germanTitle: 'Kontoauszug Gehaltskonto (Monat 1)',
    description: 'Full bank PDF statement showing salary credit.',
    required: true,
  },
  {
    docType: 'bank_statement_2',
    category: 'financial',
    title: 'Bank Statement 2',
    germanTitle: 'Kontoauszug Gehaltskonto (Monat 2)',
    description: 'Second month consecutive bank statement.',
    required: true,
  },
  {
    docType: 'bank_statement_3',
    category: 'financial',
    title: 'Bank Statement 3',
    germanTitle: 'Kontoauszug Gehaltskonto (Monat 3)',
    description: 'Third month consecutive bank statement.',
    required: true,
  },
  {
    docType: 'equity_proof',
    category: 'financial',
    title: 'Proof of Equity (Eigenkapitalnachweis)',
    germanTitle: 'Eigenkapitalnachweis (Depot/Tagesgeld)',
    description: 'Savings/deposit statements showing down payment cash.',
    required: true,
  },

  // Property
  {
    docType: 'property_expose',
    category: 'property',
    title: 'Property Exposé (Verkaufsexposé)',
    germanTitle: 'Verkaufsexposé der Immobilie',
    description: 'Realtor marketing exposé with specifications and price.',
    required: true,
  },
  {
    docType: 'grundbuch',
    category: 'property',
    title: 'Land Register Extract (Grundbuchauszug)',
    germanTitle: 'Grundbuchauszug (< 3 Monate)',
    description: 'Official German land registry extract (< 3 months old).',
    required: false,
  },
  {
    docType: 'floor_plan',
    category: 'property',
    title: 'Floor Plan & Living Space (Grundriss)',
    germanTitle: 'Grundriss & Wohnflächenberechnung',
    description: 'Floor plan with certified living square meters.',
    required: false,
  },
];
