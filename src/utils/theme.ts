export type CompanyTheme = 'servicon' | 'marketstrendai' | 'jupiterbrains';

export const COMPANY_THEMES: Record<string, CompanyTheme> = {
  'jupiterbrains': 'jupiterbrains',
  'marketstrendai': 'marketstrendai', 
  'xyzseller': 'servicon' // Map xyzseller to servicon theme
};

export const applyTheme = (theme: CompanyTheme | null) => {
  const root = document.documentElement;
  
  // Remove any existing theme
  root.removeAttribute('data-theme');
  
  // Apply new theme if provided
  if (theme) {
    root.setAttribute('data-theme', theme);
  }
};

export const getThemeForCompany = (company: string): CompanyTheme | null => {
  return COMPANY_THEMES[company] || null;
};