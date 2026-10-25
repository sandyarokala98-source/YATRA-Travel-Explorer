import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Destination } from '@/types/destination';
import { DESTINATIONS } from '@/data/destinations';
import { storageService } from '@/services/storageService';

interface WishlistContextType {
  wishlistIds: string[];
  savedDestinations: Destination[];
  isLoading: boolean;
  isSaved: (id: string) => boolean;
  toggleWishlist: (id: string) => Promise<boolean>;
  addToWishlist: (id: string) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize wishlist from AsyncStorage on app launch
  useEffect(() => {
    let isMounted = true;
    async function loadSavedWishlist() {
      try {
        const stored = await storageService.getWishlist();
        if (isMounted) {
          setWishlistIds(stored);
        }
      } catch (err) {
        console.warn('WishlistContext: Failed to load wishlist', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadSavedWishlist();
    return () => {
      isMounted = false;
    };
  }, []);

  const isSaved = useCallback(
    (id: string) => wishlistIds.includes(id),
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    async (id: string): Promise<boolean> => {
      const alreadySaved = wishlistIds.includes(id);
      let updated: string[];

      if (alreadySaved) {
        updated = wishlistIds.filter((item) => item !== id);
      } else {
        updated = [...wishlistIds, id];
      }

      // Optimistically update state for instant UI response
      setWishlistIds(updated);
      await storageService.saveWishlist(updated);
      return !alreadySaved;
    },
    [wishlistIds]
  );

  const addToWishlist = useCallback(
    async (id: string): Promise<void> => {
      if (!wishlistIds.includes(id)) {
        const updated = [...wishlistIds, id];
        setWishlistIds(updated);
        await storageService.saveWishlist(updated);
      }
    },
    [wishlistIds]
  );

  const removeFromWishlist = useCallback(
    async (id: string): Promise<void> => {
      if (wishlistIds.includes(id)) {
        const updated = wishlistIds.filter((item) => item !== id);
        setWishlistIds(updated);
        await storageService.saveWishlist(updated);
      }
    },
    [wishlistIds]
  );

  const clearWishlist = useCallback(async (): Promise<void> => {
    setWishlistIds([]);
    await storageService.saveWishlist([]);
  }, []);

  // Compute full Destination objects for saved IDs
  const savedDestinations = useMemo(() => {
    return wishlistIds
      .map((id) => DESTINATIONS.find((d) => d.id === id))
      .filter((d): d is Destination => Boolean(d));
  }, [wishlistIds]);

  const value = useMemo(
    () => ({
      wishlistIds,
      savedDestinations,
      isLoading,
      isSaved,
      toggleWishlist,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [wishlistIds, savedDestinations, isLoading, isSaved, toggleWishlist, addToWishlist, removeFromWishlist, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
