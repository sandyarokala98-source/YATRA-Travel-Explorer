import { Destination, MatchResult, UserPreferences } from '@/types/destination';

export const recommendationService = {
  /**
   * Evaluates and scores all destinations against user preferences.
   * Returns a sorted list of matches with percentage scores and transparent match reasons.
   */
  calculateMatches(
    destinations: Destination[],
    preferences: UserPreferences
  ): MatchResult[] {
    const { travelStyle, budgetTier, durationTier, climate, travelGroup } = preferences;

    const scoredResults: MatchResult[] = destinations.map((destination) => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Travel Style (30 points weight)
      if (travelStyle) {
        if (destination.suitableFor.includes(travelStyle)) {
          score += 30;
          const formattedStyle = travelStyle.charAt(0).toUpperCase() + travelStyle.slice(1);
          reasons.push(`Perfect for ${formattedStyle}`);
        } else {
          // Check related styles
          const relatedMap: Record<string, string[]> = {
            relaxation: ['nature', 'romantic'],
            adventure: ['nature'],
            nature: ['relaxation', 'adventure'],
            heritage: ['relaxation'],
            romantic: ['relaxation', 'nature'],
            family: ['relaxation', 'heritage'],
          };
          const related = relatedMap[travelStyle] || [];
          if (destination.suitableFor.some((s) => related.includes(s))) {
            score += 15;
            reasons.push(`Complementary ${travelStyle} experiences`);
          }
        }
      }

      // 2. Climate & Landscape Setting (25 points weight)
      if (climate) {
        if (destination.climate === climate) {
          score += 25;
          const climateLabels: Record<string, string> = {
            beach: 'Coastal beach vibes',
            mountains: 'High mountain landscapes',
            heritage: 'Historic royal monuments',
            adventure: 'Thrilling outdoor topography',
          };
          reasons.push(climateLabels[climate] || 'Matching regional climate');
        }
      }

      // 3. Budget Tier (20 points weight)
      if (budgetTier) {
        if (destination.budgetTier === budgetTier) {
          score += 20;
          reasons.push(`Fits your ${budgetTier} budget perfectly`);
        } else if (
          (budgetTier === 'Moderate' && destination.budgetTier === 'Budget') ||
          (budgetTier === 'Premium' && (destination.budgetTier === 'Moderate' || destination.budgetTier === 'Budget'))
        ) {
          score += 15;
          reasons.push(`Well within your spending limit`);
        } else {
          // Close tier
          score += 5;
        }
      }

      // 4. Trip Duration (15 points weight)
      if (durationTier) {
        if (destination.durationTier === durationTier) {
          score += 15;
          const durationLabels: Record<string, string> = {
            weekend: 'Ideal for a quick weekend escape',
            '3-5-days': 'Optimal for a 3 to 5-day getaway',
            '6+-days': 'Great for an immersive 6+ day journey',
          };
          reasons.push(durationLabels[durationTier] || 'Aligned with your travel timeframe');
        } else {
          score += 5;
        }
      }

      // 5. Travel Group (10 points weight)
      if (travelGroup) {
        if (destination.travelGroups.includes(travelGroup)) {
          score += 10;
          const groupLabels: Record<string, string> = {
            solo: 'Highly safe and welcoming for solo explorers',
            friends: 'Lively atmosphere for friends and groups',
            family: 'Family-friendly with wholesome attractions',
            couple: 'Romantic ambiance ideal for couples',
          };
          reasons.push(groupLabels[travelGroup] || `Great for ${travelGroup} travel`);
        }
      }

      // If user selected fewer filters, normalize the score to 100%
      let maxPossibleScore = 0;
      if (travelStyle) maxPossibleScore += 30;
      if (climate) maxPossibleScore += 25;
      if (budgetTier) maxPossibleScore += 20;
      if (durationTier) maxPossibleScore += 15;
      if (travelGroup) maxPossibleScore += 10;

      // Handle case when no filters selected
      const finalScore = maxPossibleScore > 0 ? Math.round((score / maxPossibleScore) * 100) : 50;
      const partialMatch = finalScore < 70;

      // Ensure at least one positive highlight reason
      if (reasons.length === 0) {
        reasons.push(`Top destination rated ${destination.rating}★ with stunning sights`);
      }

      return {
        destination,
        score: finalScore,
        matchReasons: reasons,
        partialMatch,
      };
    });

    // Sort by descending match score, then by destination rating
    return scoredResults.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.destination.rating - a.destination.rating;
    });
  },
};
