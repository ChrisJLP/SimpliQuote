// utils/storage.js

const APP_VERSION = "1.0.0";
const APP_PREFIX = "simpliquote_";

export const storage = {
  /**
   * Save data to localStorage with error handling
   */
  save: (key, data) => {
    try {
      const storageKey = `${APP_PREFIX}${key}`;
      const storageData = {
        version: APP_VERSION,
        timestamp: new Date().toISOString(),
        data,
      };
      localStorage.setItem(storageKey, JSON.stringify(storageData));
      return true;
    } catch (error) {
      console.error(`Error saving data for key ${key}:`, error);
      return false;
    }
  },

  /**
   * Load data from localStorage with error handling and validation
   */
  load: (key, defaultValue = null) => {
    try {
      const storageKey = `${APP_PREFIX}${key}`;
      const storedItem = localStorage.getItem(storageKey);

      if (!storedItem) return defaultValue;

      const { data } = JSON.parse(storedItem);
      return data;
    } catch (error) {
      console.error(`Error loading data for key ${key}:`, error);
      return defaultValue;
    }
  },

  /**
   * Remove data from localStorage
   */
  remove: (key) => {
    try {
      const storageKey = `${APP_PREFIX}${key}`;
      localStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      return false;
    }
  },

  /**
   * Check if localStorage is available
   */
  isAvailable: () => {
    try {
      const testKey = `${APP_PREFIX}test`;
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  },
};
