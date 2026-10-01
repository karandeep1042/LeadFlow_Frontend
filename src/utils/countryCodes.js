export const COUNTRY_CODES = [
  { code: '+49', country: 'Germany', iso: 'DE', flag: '🇩🇪' },
  { code: '+43', country: 'Austria', iso: 'AT', flag: '🇦🇹' },
  { code: '+41', country: 'Switzerland', iso: 'CH', flag: '🇨🇭' },
  { code: '+44', country: 'United Kingdom', iso: 'GB', flag: '🇬🇧' },
  { code: '+1', country: 'United States', iso: 'US', flag: '🇺🇸' },
  { code: '+1', country: 'Canada', iso: 'CA', flag: '🇨🇦' },
  { code: '+33', country: 'France', iso: 'FR', flag: '🇫🇷' },
  { code: '+34', country: 'Spain', iso: 'ES', flag: '🇪🇸' },
  { code: '+39', country: 'Italy', iso: 'IT', flag: '🇮🇹' },
  { code: '+31', country: 'Netherlands', iso: 'NL', flag: '🇳🇱' },
  { code: '+32', country: 'Belgium', iso: 'BE', flag: '🇧🇪' },
  { code: '+48', country: 'Poland', iso: 'PL', flag: '🇵🇱' },
  { code: '+351', country: 'Portugal', iso: 'PT', flag: '🇵🇹' },
  { code: '+353', country: 'Ireland', iso: 'IE', flag: '🇮🇪' },
  { code: '+46', country: 'Sweden', iso: 'SE', flag: '🇸🇪' },
  { code: '+47', country: 'Norway', iso: 'NO', flag: '🇳🇴' },
  { code: '+45', country: 'Denmark', iso: 'DK', flag: '🇩🇰' },
  { code: '+358', country: 'Finland', iso: 'FI', flag: '🇫🇮' },
  { code: '+30', country: 'Greece', iso: 'GR', flag: '🇬🇷' },
  { code: '+420', country: 'Czech Republic', iso: 'CZ', flag: '🇨🇿' },
  { code: '+36', country: 'Hungary', iso: 'HU', flag: '🇭🇺' },
  { code: '+40', country: 'Romania', iso: 'RO', flag: '🇷🇴' },
  { code: '+352', country: 'Luxembourg', iso: 'LU', flag: '🇱🇺' },
  { code: '+91', country: 'India', iso: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'Australia', iso: 'AU', flag: '🇦🇺' },
  { code: '+64', country: 'New Zealand', iso: 'NZ', flag: '🇳🇿' },
  { code: '+971', country: 'United Arab Emirates', iso: 'AE', flag: '🇦🇪' },
  { code: '+966', country: 'Saudi Arabia', iso: 'SA', flag: '🇸🇦' },
  { code: '+65', country: 'Singapore', iso: 'SG', flag: '🇸🇬' },
  { code: '+852', country: 'Hong Kong', iso: 'HK', flag: '🇭🇰' },
  { code: '+81', country: 'Japan', iso: 'JP', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', iso: 'KR', flag: '🇰🇷' },
  { code: '+86', country: 'China', iso: 'CN', flag: '🇨🇳' },
  { code: '+90', country: 'Turkey', iso: 'TR', flag: '🇹🇷' },
  { code: '+55', country: 'Brazil', iso: 'BR', flag: '🇧🇷' },
  { code: '+52', country: 'Mexico', iso: 'MX', flag: '🇲🇽' },
  { code: '+27', country: 'South Africa', iso: 'ZA', flag: '🇿🇦' },
  { code: '+20', country: 'Egypt', iso: 'EG', flag: '🇪🇬' },
  { code: '+92', country: 'Pakistan', iso: 'PK', flag: '🇵🇰' },
  { code: '+880', country: 'Bangladesh', iso: 'BD', flag: '🇧🇩' },
  { code: '+62', country: 'Indonesia', iso: 'ID', flag: '🇮🇩' },
  { code: '+60', country: 'Malaysia', iso: 'MY', flag: '🇲🇾' },
  { code: '+63', country: 'Philippines', iso: 'PH', flag: '🇵🇭' },
  { code: '+84', country: 'Vietnam', iso: 'VN', flag: '🇻🇳' },
  { code: '+66', country: 'Thailand', iso: 'TH', flag: '🇹🇭' },
  { code: '+380', country: 'Ukraine', iso: 'UA', flag: '🇺🇦' },
  { code: '+972', country: 'Israel', iso: 'IL', flag: '🇮🇱' },
  { code: '+54', country: 'Argentina', iso: 'AR', flag: '🇦🇷' },
  { code: '+56', country: 'Chile', iso: 'CL', flag: '🇨🇱' },
  { code: '+57', country: 'Colombia', iso: 'CO', flag: '🇨🇴' },
  { code: '+234', country: 'Nigeria', iso: 'NG', flag: '🇳🇬' },
  { code: '+254', country: 'Kenya', iso: 'KE', flag: '🇰🇪' },
  { code: '+974', country: 'Qatar', iso: 'QA', flag: '🇶🇦' },
  { code: '+965', country: 'Kuwait', iso: 'KW', flag: '🇰🇼' },
  { code: '+973', country: 'Bahrain', iso: 'BH', flag: '🇧🇭' },
  { code: '+968', country: 'Oman', iso: 'OM', flag: '🇴🇲' },
];

/**
 * Splits a full telephone string into countryCode and nationalNumber.
 * Example: "+49 170 1234567" -> { countryCode: "+49", nationalNumber: "170 1234567" }
 */
export const splitPhoneNumber = (fullPhone = '', defaultCode = '+49') => {
  if (!fullPhone || typeof fullPhone !== 'string') {
    return { countryCode: defaultCode, nationalNumber: '' };
  }

  const clean = fullPhone.trim();
  if (clean.startsWith('+')) {
    // Sort country codes by prefix length descending to match longest code first (+351 vs +35)
    const sortedCodes = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length);
    for (const item of sortedCodes) {
      if (clean.startsWith(item.code)) {
        const national = clean.slice(item.code.length).trim();
        return { countryCode: item.code, nationalNumber: national };
      }
    }
    // Fallback: match + and 1-4 digits
    const match = clean.match(/^(\+\d{1,4})\s*(.*)$/);
    if (match) {
      return { countryCode: match[1], nationalNumber: match[2].trim() };
    }
  }

  // If phone starts with 0 (e.g. German domestic 0170 1234567), strip the leading 0 when pairing with country code
  const nationalWithoutLeadingZero = clean.replace(/^0+/, '');
  return { countryCode: defaultCode, nationalNumber: nationalWithoutLeadingZero || clean };
};

/**
 * Combines countryCode and nationalNumber into a standard international format.
 */
export const formatFullPhoneNumber = (countryCode = '+49', nationalNumber = '') => {
  const trimmedNum = (nationalNumber || '').toString().trim();
  if (!trimmedNum) return '';
  const code = (countryCode || '+49').trim();
  return `${code} ${trimmedNum}`;
};
