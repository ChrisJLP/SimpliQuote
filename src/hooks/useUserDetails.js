// hooks/useUserDetails.js
import { useState, useEffect } from "react";

const STORAGE_KEY = "simpliquote_user_details";
const HAS_SEEN_WELCOME = "simpliquote_has_seen_welcome";

export const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // Check if user has seen welcome modal
    const hasSeenWelcome = localStorage.getItem(HAS_SEEN_WELCOME);

    // Load saved user details
    const savedDetails = localStorage.getItem(STORAGE_KEY);
    if (savedDetails) {
      setUserDetails(JSON.parse(savedDetails));
    }

    // Show welcome modal if user hasn't seen it
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
    }
  }, []);

  const saveUserDetails = (details) => {
    setUserDetails(details);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
    localStorage.setItem(HAS_SEEN_WELCOME, "true");
  };

  const skipWelcome = () => {
    localStorage.setItem(HAS_SEEN_WELCOME, "true");
    setShowWelcomeModal(false);
  };

  return {
    userDetails,
    showWelcomeModal,
    setShowWelcomeModal,
    saveUserDetails,
    skipWelcome,
  };
};
