export const getSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  
  // Handle localhost development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null;
  }
  
  // Split hostname and check for subdomain
  const parts = hostname.split('.');
  
  // If we have more than 2 parts (subdomain.domain.com) or exact matches
  if (parts.length > 2) {
    return parts[0].toLowerCase();
  }
  
  // Handle direct subdomain matches for development/staging
  if (hostname.toLowerCase() === 'jupiterbrains' || 
      hostname.toLowerCase() === 'markettrendsai' || 
      hostname.toLowerCase() === 'xyzseller') {
    return hostname.toLowerCase();
  }
  
  return null;
};

export const getCompanyFromSubdomain = (subdomain: string | null): string | null => {
  if (!subdomain) return null;
  
  const subdomainMap: { [key: string]: string } = {
    'jupiterbrains': 'jupiterbrains',
    'markettrendsai': 'marketstrendai', 
    'xyzseller': 'xyzseller'
  };
  
  return subdomainMap[subdomain] || null;
};