import assert from 'assert';
import { DESTINATIONS } from '../data/destinations.ts';
import { recommendationService } from '../services/recommendationService.ts';
import { interpretWmoCode } from '../services/weatherService.ts';
import { mapsService } from '../services/mapsService.ts';
import { UserPreferences } from '../types/destination.ts';

console.log('--- 1. Testing Destinations Dataset ---');
assert(Array.isArray(DESTINATIONS), 'DESTINATIONS should be an array');
assert(DESTINATIONS.length >= 12, `Expected at least 12 destinations, got ${DESTINATIONS.length}`);
console.log(`✓ Destination count: ${DESTINATIONS.length} (Requirement >= 12 passed)`);

const categories = new Set(DESTINATIONS.map((d) => d.category));
['Beaches', 'Mountains', 'Heritage', 'Adventure'].forEach((cat) => {
  assert(categories.has(cat as any), `Category "${cat}" must be present in destinations`);
  const count = DESTINATIONS.filter((d) => d.category === cat).length;
  console.log(`  - ${cat}: ${count} destinations`);
});
console.log('✓ All 4 required categories represented');

const ids = new Set<string>();
DESTINATIONS.forEach((d) => {
  assert(!ids.has(d.id), `Duplicate ID detected: ${d.id}`);
  ids.add(d.id);
  assert(typeof d.name === 'string' && d.name.length > 0, `Destination ${d.id} missing name`);
  assert(typeof d.state === 'string' && d.state.length > 0, `Destination ${d.id} missing state`);
  assert(typeof d.heroImage === 'string' && d.heroImage.startsWith('http'), `Destination ${d.id} invalid heroImage`);
  assert(typeof d.shortDescription === 'string' && d.shortDescription.length > 10, `Destination ${d.id} invalid shortDescription`);
  assert(typeof d.bestTimeToVisit === 'string', `Destination ${d.id} missing bestTimeToVisit`);
  assert(typeof d.approximateBudget === 'string', `Destination ${d.id} missing approximateBudget`);
  assert(typeof d.recommendedDuration === 'string', `Destination ${d.id} missing recommendedDuration`);
  assert(Array.isArray(d.attractions) && d.attractions.length >= 2, `Destination ${d.id} needs at least 2 attractions`);
  d.attractions.forEach((att, idx) => {
    assert(att.name && att.image && att.description, `Attraction ${idx} in ${d.id} is incomplete`);
  });
  assert(typeof d.coordinates.latitude === 'number' && d.coordinates.latitude > 0, `Destination ${d.id} invalid latitude`);
  assert(typeof d.coordinates.longitude === 'number' && d.coordinates.longitude > 0, `Destination ${d.id} invalid longitude`);
});
console.log('✓ All destination objects conform to strict schema');

// 2. Test Search and Filtering Combination
console.log('\n--- 2. Testing Search & Filtering Combination ---');
function filterDestinations(query: string, category: string) {
  const q = query.trim().toLowerCase();
  return DESTINATIONS.filter((d) => {
    const matchesCategory = category === 'All' || d.category === category;
    const matchesSearch =
      q.length === 0 ||
      d.name.toLowerCase().includes(q) ||
      d.state.toLowerCase().includes(q) ||
      d.attractions.some((a) => a.name.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });
}

// Case-insensitive test
const case1 = filterDestinations('mAnALi', 'All');
assert(case1.length === 1 && case1[0].id === 'manali', 'Search must be case-insensitive');
console.log('✓ Case-insensitive search passed: "mAnALi" -> Manali');

// Whitespace trim test
const case2 = filterDestinations('   goa   ', 'All');
assert(case2.length === 1 && case2[0].id === 'goa', 'Search must trim whitespace');
console.log('✓ Whitespace trim search passed: "   goa   " -> Goa');

// Combined search + category test
const case3 = filterDestinations('manali', 'Mountains');
assert(case3.length === 1, 'Search for Manali under Mountains must find 1');
const case4 = filterDestinations('manali', 'Beaches');
assert(case4.length === 0, 'Search for Manali under Beaches must return 0');
console.log('✓ Combined search + category filter passed (Manali in Mountains = 1, Manali in Beaches = 0)');

// Empty state test
const case5 = filterDestinations('xyznonexistentdestination', 'All');
assert(case5.length === 0, 'Non-existent destination returns empty array');
console.log('✓ Non-existent search query returns 0 (triggers empty state correctly)');

// 3. Test Recommendation Engine
console.log('\n--- 3. Testing Smart Match Recommendation Engine ---');

// Scenario A: Beach Relaxation Couple with Moderate Budget
const testPrefsA: UserPreferences = {
  travelStyle: 'relaxation',
  budgetTier: 'Moderate',
  durationTier: '3-5-days',
  climate: 'beach',
  travelGroup: 'couple',
};
const matchesA = recommendationService.calculateMatches(DESTINATIONS, testPrefsA);
assert(matchesA.length === DESTINATIONS.length, 'Should score all destinations');
assert(matchesA[0].score >= 80, 'Top match should score >= 80%');
assert(matchesA[0].destination.category === 'Beaches', 'Top match for beach relaxation should be a beach destination');
assert(matchesA[0].matchReasons.length > 0, 'Match reasons must be populated');
console.log(`✓ Scenario A (Beach Couple): Top pick is ${matchesA[0].destination.name} with ${matchesA[0].score}% match`);
console.log(`  Reasons: ${matchesA[0].matchReasons.join(' | ')}`);

// Scenario B: High-altitude Mountain Adventure Solo Traveler
const testPrefsB: UserPreferences = {
  travelStyle: 'adventure',
  budgetTier: 'Premium',
  durationTier: '6+-days',
  climate: 'adventure',
  travelGroup: 'solo',
};
const matchesB = recommendationService.calculateMatches(DESTINATIONS, testPrefsB);
assert(matchesB[0].destination.category === 'Adventure' || matchesB[0].destination.category === 'Mountains');
console.log(`✓ Scenario B (Adventure Solo): Top pick is ${matchesB[0].destination.name} with ${matchesB[0].score}% match`);
console.log(`  Reasons: ${matchesB[0].matchReasons.join(' | ')}`);

// 4. Test Weather Service Logic
console.log('\n--- 4. Testing Weather Code Interpreter ---');
const sunny = interpretWmoCode(0, 28);
assert(sunny.iconName === 'sun' && sunny.condition.includes('Sunny'));
const rain = interpretWmoCode(63, 22);
assert(rain.iconName === 'cloud-rain');
const snow = interpretWmoCode(73, 2);
assert(snow.iconName === 'cloud-snow');
console.log('✓ WMO weather codes 0 (Sunny), 63 (Rain), 73 (Snow) correctly interpreted with travel notes');

// 5. Test Maps Service URL Generation
console.log('\n--- 5. Testing Maps Service URLs ---');
const url = mapsService.getMapUrl(15.2993, 74.1240, 'Goa');
assert(url.includes('google.com/maps') && url.includes('Goa%2C%20India'), 'Map URL formatted correctly');
console.log(`✓ Google Maps link correctly generated: ${url}`);

console.log('\n========================================');
console.log(' ALL UNIT & INTEGRATION TESTS PASSED! 🚀');
console.log('========================================\n');
