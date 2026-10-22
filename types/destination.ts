export type DestinationCategory = 'Beaches' | 'Mountains' | 'Heritage' | 'Adventure';

export type BudgetTier = 'Budget' | 'Moderate' | 'Premium';

export type DurationTier = 'weekend' | '3-5-days' | '6+-days';

export type TravelStyle =
  | 'relaxation'
  | 'adventure'
  | 'nature'
  | 'heritage'
  | 'romantic'
  | 'family';

export type TravelGroup = 'solo' | 'friends' | 'family' | 'couple';

export type PreferredClimate = 'beach' | 'mountains' | 'heritage' | 'adventure';

export interface Attraction {
  id: string;
  name: string;
  image: string;
  description: string;
  tag?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  category: DestinationCategory;
  heroImage: string;
  shortDescription: string;
  fullDescription: string;
  bestTimeToVisit: string;
  bestSeason: string;
  approximateBudget: string; // e.g. "₹8,000 - ₹15,000"
  budgetAmount: number; // numeric average/base for sorting/filtering
  budgetTier: BudgetTier;
  recommendedDuration: string; // e.g. "3 - 4 Days"
  durationTier: DurationTier;
  attractions: Attraction[];
  coordinates: Coordinates;
  suitableFor: TravelStyle[];
  travelGroups: TravelGroup[];
  climate: PreferredClimate;
  rating: number; // e.g. 4.8
  reviewsCount: number;
  highlightTag?: string; // e.g. "Top Rated", "Editor's Pick", "Trending"
  isFeatured?: boolean;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  iconName: string;
  travelNote: string;
  fetchedAt: number;
}

export interface UserPreferences {
  travelStyle: TravelStyle | null;
  budgetTier: BudgetTier | null;
  durationTier: DurationTier | null;
  climate: PreferredClimate | null;
  travelGroup: TravelGroup | null;
}

export interface MatchResult {
  destination: Destination;
  score: number; // 0 - 100 percentage
  matchReasons: string[];
  partialMatch: boolean;
}
