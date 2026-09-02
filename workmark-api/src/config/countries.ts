export interface SupportedCountry {
  code: string;
  name: string;
  currency: string;
}

export const SUPPORTED_COUNTRIES: SupportedCountry[] = [
  { code: 'in', name: 'India', currency: 'INR' },
  { code: 'us', name: 'United States', currency: 'USD' },
  { code: 'gb', name: 'United Kingdom', currency: 'GBP' },
  { code: 'ca', name: 'Canada', currency: 'CAD' },
  { code: 'au', name: 'Australia', currency: 'AUD' },
  { code: 'de', name: 'Germany', currency: 'EUR' },
  { code: 'fr', name: 'France', currency: 'EUR' },
  { code: 'nl', name: 'Netherlands', currency: 'EUR' },
  { code: 'sg', name: 'Singapore', currency: 'SGD' },
  { code: 'nz', name: 'New Zealand', currency: 'NZD' },
];

export const getDefaultSearchCountries = (): string[] => (process.env.ADZUNA_DEFAULT_COUNTRIES || 'in,us,gb,ca,au')
  .split(',')
  .map((code) => code.trim().toLowerCase())
  .filter((code) => SUPPORTED_COUNTRIES.some((country) => country.code === code));

export const getCountry = (code: string): SupportedCountry | undefined =>
  SUPPORTED_COUNTRIES.find((country) => country.code === code.toLowerCase());
