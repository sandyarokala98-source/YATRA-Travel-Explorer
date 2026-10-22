import { Linking, Platform } from 'react-native';

export const mapsService = {
  /**
   * Generates web & native Google Maps URL for coordinates and query
   */
  getMapUrl(latitude: number, longitude: number, destinationName?: string): string {
    const encodedName = encodeURIComponent(destinationName ? `${destinationName}, India` : `${latitude},${longitude}`);
    return `https://www.google.com/maps/search/?api=1&query=${encodedName}`;
  },

  /**
   * Opens destination location in device's map app or web browser
   */
  async openDestinationInMaps(
    latitude: number,
    longitude: number,
    destinationName: string
  ): Promise<boolean> {
    const encodedName = encodeURIComponent(`${destinationName}, India`);

    // Android supports native geo intent with label
    const nativeUri = Platform.select({
      android: `geo:${latitude},${longitude}?q=${encodedName}`,
      ios: `maps:0,0?q=${encodedName}`,
      default: `https://www.google.com/maps/search/?api=1&query=${encodedName}`,
    });

    const webFallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodedName}`;

    try {
      const canOpen = await Linking.canOpenURL(nativeUri);
      if (canOpen) {
        await Linking.openURL(nativeUri);
        return true;
      }
      // Fallback to web link
      await Linking.openURL(webFallbackUrl);
      return true;
    } catch (error) {
      console.warn('MapsService: Error opening map URL, attempting web fallback', error);
      try {
        await Linking.openURL(webFallbackUrl);
        return true;
      } catch (fallbackError) {
        console.error('MapsService: Could not open map URL', fallbackError);
        return false;
      }
    }
  },
};
