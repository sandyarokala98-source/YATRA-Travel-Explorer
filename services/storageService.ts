import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '@/types/destination';

const WISHLIST_STORAGE_KEY = '@yatra_saved_destinations_v1';
const PREFERENCES_STORAGE_KEY = '@yatra_user_preferences_v1';

export const storageService = {
  /**
   * Retrieves array of saved destination IDs from AsyncStorage
   */
  async getWishlist(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.filter((id) => typeof id === 'string');
      }
      return [];
    } catch (error) {
      console.warn('StorageService: Failed to retrieve wishlist from AsyncStorage', error);
      return [];
    }
  },

  /**
   * Saves updated destination IDs array to AsyncStorage
   */
  async saveWishlist(destinationIds: string[]): Promise<boolean> {
    try {
      // Remove any potential duplicates and filter valid strings
      const uniqueIds = Array.from(new Set(destinationIds.filter(Boolean)));
      await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(uniqueIds));
      return true;
    } catch (error) {
      console.warn('StorageService: Failed to persist wishlist to AsyncStorage', error);
      return false;
    }
  },

  /**
   * Adds an individual destination ID to the wishlist
   */
  async addToWishlist(destinationId: string): Promise<string[]> {
    try {
      const current = await this.getWishlist();
      if (!current.includes(destinationId)) {
        const updated = [...current, destinationId];
        await this.saveWishlist(updated);
        return updated;
      }
      return current;
    } catch (error) {
      console.warn('StorageService: Failed to add to wishlist', error);
      return [];
    }
  },

  /**
   * Removes a destination ID from the wishlist
   */
  async removeFromWishlist(destinationId: string): Promise<string[]> {
    try {
      const current = await this.getWishlist();
      const updated = current.filter((id) => id !== destinationId);
      await this.saveWishlist(updated);
      return updated;
    } catch (error) {
      console.warn('StorageService: Failed to remove from wishlist', error);
      return [];
    }
  },

  /**
   * Retrieves saved Smart Match user preferences
   */
  async getUserPreferences(): Promise<UserPreferences | null> {
    try {
      const data = await AsyncStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as UserPreferences;
    } catch (error) {
      console.warn('StorageService: Failed to load user preferences', error);
      return null;
    }
  },

  /**
   * Saves Smart Match user preferences
   */
  async saveUserPreferences(preferences: UserPreferences): Promise<boolean> {
    try {
      await AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.warn('StorageService: Failed to persist user preferences', error);
      return false;
    }
  },

  /**
   * Clears saved preferences
   */
  async clearUserPreferences(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PREFERENCES_STORAGE_KEY);
    } catch (error) {
      console.warn('StorageService: Failed to clear user preferences', error);
    }
  },
};
