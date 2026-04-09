import { useEffect } from "react";

function playReminderSound() {
  // Try to play water drop sound
  const audio = new Audio("/sound/water.mp3");
  audio.volume = 0.5;
  audio.play().catch(() => {
    // If file doesn't exist, use Web Audio API to generate a simple beep
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Water drop-like sound: descending frequency
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio playback not available");
    }
  });
}

export function useReminderNotification(nextReminderTimeIso: string | null | undefined) {
  useEffect(() => {
    // Request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!nextReminderTimeIso || !("Notification" in window)) return;

    // Check if notification is already shown for this reminder
    const reminderKey = `notification-${nextReminderTimeIso}`;
    if (sessionStorage.getItem(reminderKey)) return;

    try {
      const nextReminderDate = new Date(nextReminderTimeIso);
      const now = new Date();

      // If time has already passed, show immediately
      if (now >= nextReminderDate) {
        if (Notification.permission === "granted") {
          new Notification("Time to drink water 💧", {
            body: "Stay hydrated!",
            icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 10c-5 0-10 8-10 18 0 15 10 30 10 40s0 15 10 15 10-5 10-15 10-25 10-40c0-10-5-18-10-18z' fill='%230ea5e9'/></svg>",
          });
          playReminderSound();
        }
        sessionStorage.setItem(reminderKey, "shown");
        return;
      }

      // Calculate time until reminder
      const timeUntilReminder = nextReminderDate.getTime() - now.getTime();

      // Set timeout to show notification when time is reached
      const timeoutId = setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification("Time to drink water 💧", {
            body: "Stay hydrated!",
            icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 10c-5 0-10 8-10 18 0 15 10 30 10 40s0 15 10 15 10-5 10-15 10-25 10-40c0-10-5-18-10-18z' fill='%230ea5e9'/></svg>",
          });
          playReminderSound();
        }
        sessionStorage.setItem(reminderKey, "shown");
      }, timeUntilReminder);

      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error("Error setting up notification:", error);
    }
  }, [nextReminderTimeIso]);
}
