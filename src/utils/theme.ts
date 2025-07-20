export type ClientTheme = 'servicon' | 'markettrends' | 'jupiterbrains' | 'default';

export const CLIENT_THEMES: Record<string, ClientTheme> = {
  'servicon': 'servicon',
  'marketstrendai': 'markettrends', 
  'markettrends': 'markettrends',
  'jupiterbrains': 'jupiterbrains',
  'jupiter': 'jupiterbrains'
};

export const applyClientTheme = (client: string) => {
  const normalizedClient = client.toLowerCase();
  const theme = CLIENT_THEMES[normalizedClient] || 'default';
  
  // Remove existing theme classes
  document.documentElement.classList.remove(
    'theme-servicon',
    'theme-markettrends', 
    'theme-jupiterbrains'
  );
  
  // Apply new theme class if not default
  if (theme !== 'default') {
    document.documentElement.classList.add(`theme-${theme}`);
  }
  
  return theme;
};

export const getClientDisplayName = (client: string): string => {
  const displayNames: Record<string, string> = {
    'servicon': 'Servicon',
    'marketstrendai': 'MarketTrends AI',
    'markettrends': 'MarketTrends AI', 
    'jupiterbrains': 'Jupiter Brains',
    'jupiter': 'Jupiter Brains'
  };
  
  return displayNames[client.toLowerCase()] || client.charAt(0).toUpperCase() + client.slice(1);
};