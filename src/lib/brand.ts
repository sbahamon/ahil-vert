import { loadFont } from "@remotion/google-fonts/Nunito";

/**
 * AHIL Brand Constants
 * From Canva Brand Kit
 */

// Load Nunito font (matches AHIL logo style)
const { fontFamily: nunitoFamily } = loadFont();

export const colors = {
  orange: "#ef5917",
  blue: "#004aad",
  darkBlue: "#022452",
  navy: "#0b162a",
  white: "#ffffff",
} as const;

export const fonts = {
  heading: nunitoFamily,
  body: nunitoFamily,
} as const;

/**
 * Video dimensions for 9:16 vertical format
 */
export const dimensions = {
  width: 1080,
  height: 1920,
} as const;

/**
 * Default video settings
 */
export const videoDefaults = {
  fps: 30,
  durationInSeconds: 60,
} as const;

/**
 * Convert seconds to frames
 */
export const secondsToFrames = (seconds: number, fps = videoDefaults.fps) =>
  Math.round(seconds * fps);

/**
 * Accessibility: minimum text display time in frames
 */
export const minTextDisplayFrames = secondsToFrames(3);
