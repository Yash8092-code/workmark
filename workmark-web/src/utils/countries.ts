export interface CountryItem {
  code: string;
  name: string;
  flag: string;
  currency: string;
  topCities: string[];
}

export const SUPPORTED_COUNTRIES: CountryItem[] = [
  {
    code: 'in',
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    topCities: ['Bangalore', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Gurugram', 'Noida'],
  },
  {
    code: 'us',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    topCities: ['New York', 'San Francisco', 'Austin', 'Seattle', 'Chicago', 'Boston', 'Los Angeles'],
  },
  {
    code: 'gb',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    topCities: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Bristol', 'Cambridge', 'Leeds'],
  },
  {
    code: 'ca',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    topCities: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Calgary', 'Waterloo'],
  },
  {
    code: 'au',
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    topCities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
  },
  {
    code: 'de',
    name: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    topCities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Stuttgart'],
  },
  {
    code: 'fr',
    name: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    topCities: ['Paris', 'Lyon', 'Toulouse', 'Marseille', 'Nantes'],
  },
  {
    code: 'nl',
    name: 'Netherlands',
    flag: '🇳🇱',
    currency: 'EUR',
    topCities: ['Amsterdam', 'Rotterdam', 'Utrecht', 'Eindhoven', 'The Hague'],
  },
  {
    code: 'sg',
    name: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    topCities: ['Singapore', 'Central Area', 'Jurong', 'Changi'],
  },
  {
    code: 'nz',
    name: 'New Zealand',
    flag: '🇳🇿',
    currency: 'NZD',
    topCities: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton'],
  },
];

export const getCountryByCode = (code?: string): CountryItem | undefined => {
  if (!code) return undefined;
  return SUPPORTED_COUNTRIES.find((c) => c.code.toLowerCase() === code.toLowerCase());
};

export const getSuggestedCities = (code?: string): string[] => {
  if (!code || code === 'all') {
    return ['Bangalore', 'London', 'New York', 'Toronto', 'Berlin', 'Singapore', 'Sydney'];
  }
  const found = getCountryByCode(code);
  return found?.topCities || [];
};

export const getCountryFlag = (codeOrName?: string): string => {
  if (!codeOrName) return '🌐';
  const clean = codeOrName.toLowerCase().trim();
  const found = SUPPORTED_COUNTRIES.find(
    (c) => c.code.toLowerCase() === clean || c.name.toLowerCase() === clean
  );
  return found?.flag || '📍';
};

export const getCountryDisplayName = (codeOrName?: string): string => {
  if (!codeOrName) return '';
  const clean = codeOrName.toLowerCase().trim();
  const found = SUPPORTED_COUNTRIES.find(
    (c) => c.code.toLowerCase() === clean || c.name.toLowerCase() === clean
  );
  return found?.name || codeOrName;
};