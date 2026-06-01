export const VIDEO_PROVIDER = 'VIDEO_PROVIDER';

/** Minimal shape of a MovieFile needed to resolve a playback URL. */
export interface PlayableFile {
  url: string;
  quality: string;
  storageProvider?: string | null;
  storagePath?: string | null;
}

export interface PlaybackSource {
  url: string;
  provider: string;
  quality: string;
  /** Set when the URL is time-limited (signed). */
  expiresAt: Date | null;
}

export interface PlaybackOptions {
  /** Seconds the signed URL should remain valid (providers that support it). */
  ttlSeconds?: number;
}

/**
 * Abstraction over the video origin/CDN. The default (LocalVideoProvider)
 * returns the stored URL as-is. Set VIDEO_PROVIDER=bunny to generate
 * Bunny.net CDN (optionally token-authenticated) playback URLs.
 */
export interface VideoProvider {
  readonly name: string;
  getPlaybackSource(file: PlayableFile, opts?: PlaybackOptions): PlaybackSource;
}
