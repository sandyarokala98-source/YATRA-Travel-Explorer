# YATRA — Premium India Travel Explorer

> **Discover India, Your Way.**  
> A mobile travel discovery application designed and crafted for the **GDGC VNRVJIET App Development Domain Volunteer Recruitment Assignment**.

---

## 1. Project Overview & Problem Statement

### Overview
**YATRA** is an editorial travel companion built with React Native and Expo (TypeScript). It empowers travelers to explore India’s geographic, cultural, and environmental richness—from the palm-lined beaches of Goa and Varkala to the snow-capped Himalayan ridges of Manali and Spiti Valley, royal Mughal fortresses in Jaipur and Agra, and adrenaline-charged white water rapids in Rishikesh.

### Problem Statement
Travelers exploring India often struggle with fragmented information:
1. Destination guides lack actionable budget estimations and seasonal timing.
2. Generic recommendation apps use opaque black-box recommendations without explaining *why* a location fits the traveler’s needs.
3. Live environmental conditions (weather, humidity, temperature) require jumping across multiple weather apps.
4. Trip ideas and bookmarks are easily lost without local, reliable offline-friendly persistence.

**YATRA** solves this through a unified mobile experience featuring:
* A curated dataset of **13 Indian destinations** across **Beaches, Mountains, Heritage, and Adventure**.
* A transparent, multi-factor **Smart Destination Matcher**.
* Direct **Open-Meteo live weather sync** with WMO atmospheric interpretation and travel advice.
* One-touch **Google Maps external link navigation**.
* Synchronized, persistent **Wishlist storage with AsyncStorage**.

---

## 2. Key Features

### 🌟 1. Editorial Home & Explore Screen
* **Brand Aesthetic**: Deep forest green (`#1B4332`), warm ivory (`#FAF7F2`), and terracotta accents (`#C85A32`).
* **Personalized Greeting**: Welcoming hero banner with quick call-to-actions.
* **Instant Search**: Real-time search across destination names, states, and attraction keywords.
* **Category Filters**: Dedicated filter chips (`All`, `Beaches`, `Mountains`, `Heritage`, `Adventure`) with live destination count badges.
* **Unified Filtering**: Search query and category filter operate concurrently without state erasure.
* **Featured Showcase**: Hero cards with high-resolution photography, ratings, tags, and quick-save wishlist toggles.

### 📍 2. Rich Destination Details Screen
* **Parallax Header**: High-resolution photography with safe-area back navigation and floating heart toggle.
* **Key Travel Metrics**: Best visiting season, approximate budget per person, recommended itinerary length, and suitable travel styles.
* **Comprehensive Description**: Curated history, geography, and travel atmosphere.
* **Popular Attractions**: 2–3 attractions per destination with photography, descriptions, and highlights.
* **Live Weather Widget**: Current temperature in °C, weather condition, relative humidity, wind speed, and contextual travel advice.
* **External Google Maps**: Native map link launcher with query fallback.

### ⚡ 3. Smart Destination Matcher (Interactive Recommendation Engine)
* **Preference Categories**:
  1. *Travel Style*: Relaxation, Adventure, Nature, Heritage, Romantic, Family.
  2. *Budget Tier*: Budget (< ₹12k), Moderate (₹12k–₹25k), Premium (> ₹25k).
  3. *Trip Duration*: Weekend (2–3 days), 3–5 days, 6+ days.
  4. *Climate & Setting*: Beaches, Mountains, Historic Cities, Outdoor Terrains.
  5. *Travel Group*: Solo, Couple, Friends, Family.
* **Deterministic Algorithm**: Weighted scoring engine (30% style, 25% climate, 20% budget, 15% duration, 10% group).
* **Transparent Reasoning**: Displays exact criteria matches (e.g., *"Perfect for Adventure"*, *"Fits your Moderate budget"*, *"Ideal for weekend getaway"*).
* **Preference Persistence**: User selections persist in local storage for recurring sessions.

### 💖 4. Persistent Wishlist
* **Synchronized State**: Instant update across Explore, Details, and Wishlist screens powered by React Context.
* **Local Persistence**: Powered by `@react-native-async-storage/async-storage` to ensure wishlist items survive app restarts.
* **Deduplication**: Prevents duplicate entries.
* **Empty State**: Friendly illustration and call-to-action button routing users to Explore.
* **Clear All**: Safe modal confirmation to wipe saved wishlist items.

### 🌤️ 5. Live Open-Meteo Weather Integration
* Free, open-access meteorological data from [Open-Meteo](https://open-meteo.com/).
* Queries `temperature_2m`, `relative_humidity_2m`, `weather_code`, and `wind_speed_10m` using destination coordinates.
* Translates WMO weather codes into human-readable conditions and Feather icons.
* Contextual travel advisory generator (e.g., rain gear reminders, sunscreen tips, cold-weather layer advice).
* In-memory 15-minute caching and timeout protection to prevent rate exhaustion.

### 🗺️ 6. Google Maps Link Integration
* Deep link to native Google Maps / Apple Maps using `geo:` and web fallbacks.
* Handles device link-opening errors gracefully without requiring paid SDKs or proprietary API keys.

---

## 3. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | [React Native](https://reactnative.dev/) | `0.88.0` | Cross-platform native mobile runtime |
| **Platform** | [Expo SDK](https://expo.dev/) | `~58.0.17` | Toolchain, development server & native modules |
| **Routing** | [Expo Router](https://docs.expo.dev/router/introduction/) | `~58.0.25` | File-based navigation (Tabs + Stack) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `~6.0.3` | Type safety and documentation integrity |
| **Storage** | [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | `2.2.0` | Local persistent storage |
| **Gradients** | [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) | `~58.0.3` | Hero overlays and aesthetic depth |
| **Icons** | [@expo/vector-icons](https://icons.expo.fyi/) | `^15.0.2` | Ionicons & Feather glyphs |
| **Weather** | [Open-Meteo REST API](https://open-meteo.com/) | v1 | Live temperature, humidity, wind & WMO codes |
| **Maps** | `Linking` API | Built-in | Google Maps intent and browser fallback |

---

## 4. Application Architecture

```
YATRA/
├── app/                          # Expo Router Screens
│   ├── (tabs)/                   # Bottom Tab Navigator
│   │   ├── _layout.tsx           # Tab bar styling & badges
│   │   ├── index.tsx             # Home / Explore Screen
│   │   ├── match.tsx             # Smart Destination Matcher Screen
│   │   └── wishlist.tsx          # Saved Wishlist Screen
│   ├── destination/
│   │   └── [id].tsx              # Dynamic Destination Details Screen
│   ├── modal.tsx                 # About Yatra & Assignment Info Modal
│   ├── +not-found.tsx            # Custom 404 Route Handler
│   └── _layout.tsx               # Root Layout with Theme & WishlistProvider
├── components/                   # Modular UI Components
│   ├── SearchBar.tsx             # Search input with clear button
│   ├── CategoryFilter.tsx        # Horizontal category selector
│   ├── DestinationCard.tsx       # Featured, Standard, and Compact cards
│   ├── AttractionCard.tsx        # Attraction showcase with badges
│   ├── WeatherCard.tsx           # Live weather with retry & status
│   ├── MatchOptionGroup.tsx      # Multi-choice preference chips
│   └── EmptyState.tsx            # Universal friendly empty state
├── data/
│   └── destinations.ts           # Curated 13-destination local dataset
├── types/
│   └── destination.ts           # Strict TypeScript contracts & interfaces
├── services/
│   ├── weatherService.ts         # Open-Meteo API client & WMO translator
│   ├── storageService.ts         # Safe AsyncStorage reading & writing
│   ├── mapsService.ts            # Map URL generator & deep-linking
│   └── recommendationService.ts  # Weighted recommendation scoring engine
├── context/
│   └── WishlistContext.tsx       # React Context for synchronized wishlist state
├── hooks/
│   └── useWishlist.ts            # Wishlist consumer hook
├── constants/
│   ├── theme.ts                  # Design tokens (Colors, Spacing, Shadows, Radii)
│   └── Colors.ts                 # Legacy theme fallback
├── assets/                       # App icons, splash screens, and fonts
└── package.json                  # Dependencies and execution scripts
```

---

## 5. Getting Started & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended; developed on Node v24)
* [Expo Go](https://expo.dev/go) app installed on your physical mobile device (Android or iOS), or an Android/iOS emulator.

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/gdgc-yatra-travel-explorer.git
cd gdgc-yatra-travel-explorer
```

### 2. Install Compatible Dependencies
```bash
npm install
```

### 3. Verify Project Health
```bash
# Verify TypeScript strict compilation
npx tsc --noEmit

# Diagnose Expo configuration & dependencies
npx expo-doctor
```

---

## 6. Running the Application

### Start the Expo Development Server
```bash
npx expo start
```

### Running on Physical Android Device (Recommended)
1. Open the **Expo Go** application on your Android phone.
2. Ensure your phone and development computer are connected to the same Wi-Fi network.
3. Scan the QR code displayed in your terminal or Metro web interface.
4. *Alternative*: If your computer and phone are on different subnets or mobile hotspot, run:
   ```bash
   npx expo start --tunnel
   ```

### Running on Web Browser
```bash
npx expo start --web
```

---

## 7. Deep Dive: Key Technical Implementations

### A. Recommendation Scoring Algorithm (`recommendationService.ts`)
The Smart Match algorithm uses a multi-factor weighted scoring model that evaluates every destination against the user's selected preferences:
1. **Travel Style (30 points)**: Full score for exact style match (e.g., `relaxation`), 15 points for complementary styles (e.g., `nature` with `relaxation`).
2. **Climate / Landscape Setting (25 points)**: Matches terrain environment (`beach`, `mountains`, `heritage`, `adventure`).
3. **Budget Tier (20 points)**: Exact tier match awards 20 points; choosing a higher tier with a lower-cost destination awards 15 points (*"well within your budget"*).
4. **Duration Tier (15 points)**: Aligns itinerary length (`weekend`, `3-5-days`, `6+-days`).
5. **Travel Group (10 points)**: Matches dynamic suitability (`solo`, `couple`, `friends`, `family`).

Scores are normalized to a 0–100% scale. Destinations scoring $\ge 80\%$ are highlighted with primary match badges; partial matches are tagged with transparent reasoning.

### B. Live Weather Integration (`weatherService.ts`)
* **Endpoint**: `https://api.open-meteo.com/v1/forecast`
* **Parameters**: `latitude`, `longitude`, `current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
* **Error Resilience**: Includes a 9-second `AbortController` timeout, in-memory 15-minute cache per coordinate, and friendly offline fallback states.

### C. Persistent Storage with AsyncStorage (`storageService.ts`)
* Safely reads and writes JSON arrays of destination IDs.
* Performs duplicate removal via `Array.from(new Set(ids))`.
* Optimistically updates React state so heart buttons respond instantaneously without UI lag.

### D. Google Maps External Navigation (`mapsService.ts`)
* Uses native scheme `geo:lat,lng?q=Name,India` on Android and `maps:0,0?q=Name,India` on iOS.
* Falls back to `https://www.google.com/maps/search/?api=1&query=...` on web and if native intents are unavailable.

---

## 8. Verification & Test Checklist

| Feature | Test Case | Status |
| :--- | :--- | :--- |
| **Dependencies** | Installed clean SDK 58 compatible modules | ✅ PASS |
| **TypeScript** | Strict typecheck (`npx tsc --noEmit`) with 0 errors | ✅ PASS |
| **Doctor Check** | `npx expo-doctor` 20/20 diagnostics passed | ✅ PASS |
| **Metro Bundler** | Full static bundle export across all 10 routes | ✅ PASS |
| **Destinations Data** | 13 destinations across Beaches, Mountains, Heritage, Adventure | ✅ PASS |
| **Search Function** | Case-insensitive search, whitespace trim, clear button | ✅ PASS |
| **Category Filter** | Filter chips with badge counts, co-operates with search | ✅ PASS |
| **Destination Details** | Hero photography, stats row, full description, attractions | ✅ PASS |
| **Invalid Route** | Friendly 404 / destination not found screen without crash | ✅ PASS |
| **Wishlist Persistence** | Immediate UI response, deduplication, survives app restarts | ✅ PASS |
| **Smart Match Quiz** | 5 preference groups, deterministic scoring, match explanations | ✅ PASS |
| **Live Weather** | Live Open-Meteo temperature, humidity, wind, and advice note | ✅ PASS |
| **Google Maps Link** | Deep link to Google Maps with destination coordinates | ✅ PASS |
| **Image Fallbacks** | Graceful fallback placeholder when images fail to load | ✅ PASS |

---

## 9. Screenshots

| Explore / Home Screen | Category & Search | Destination Details |
| :---: | :---: | :---: |
| *(Hero Carousel & Categories)* | *(Combined Filtering & Badges)* | *(Weather, Stats & Attractions)* |

| Smart Destination Matcher | Match Results & Reasons | Saved Wishlist |
| :---: | :---: | :---: |
| *(Interactive 5-question quiz)* | *(Ranked Matches with % & tags)* | *(Persisted Saved Escapes)* |

*(Screenshots can be captured directly from your Expo Go device or emulator and added to `assets/screenshots/`)*.

---

## 10. Limitations & Future Roadmap

* **Offline Maps**: Currently opens Google Maps externally; future versions could bundle offline vector maps via Mapbox or MapLibre.
* **User Reviews**: Reviews are currently statically weighted; adding a community review submission feature via a lightweight Firebase backend.
* **Multi-Currency**: Automatic currency conversion for international travelers visiting India.
* **Trip Packing Checklist**: Interactive gear checklist generated according to the destination's live weather.

---

## 11. Git Commands for GitHub Submission

To publish this project to GitHub under `gdgc-yatra-travel-explorer`:

```bash
# 1. Add all project files
git add .

# 2. Commit the verified application
git commit -m "feat: complete YATRA Travel Explorer app for GDGC recruitment"

# 3. Rename branch to main (if not already main)
git branch -M main

# 4. Link your remote GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/gdgc-yatra-travel-explorer.git

# 5. Push to GitHub
git push -u origin main
```

---

## 12. License & Acknowledgments

* **GDGC VNRVJIET**: Google Developer Groups on Campus - VNR Vignana Jyothi Institute of Engineering and Technology.
* **Open-Meteo**: Free weather API for non-commercial and open data access.
* **Unsplash**: Royalty-free destination photography.

*Built with passion for India's diverse landscapes and modern mobile engineering.*
