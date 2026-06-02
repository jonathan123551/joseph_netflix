import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import {
  PlayableFile,
  PlaybackOptions,
  PlaybackSource,
  VideoProvider,
} from './video-provider.interface';

/**
 * Bunny.net-ready provider. Builds a CDN URL from the file's storagePath
 * (falling back to its stored url) and, when BUNNY_TOKEN_KEY is configured,
 * signs it with Bunny's token-authentication scheme.
 *
 * Env:
 *   BUNNY_CDN_HOSTNAME  e.g. "joseph-films.b-cdn.net"
 *   BUNNY_TOKEN_KEY     pull-zone token authentication key (optional)
 *
 * Bunny token auth: token = base64url( md5_raw( tokenKey + path + expires ) )
 * appended as `?token=<token>&expires=<unixSeconds>`.
 */
@Injectable()
export class BunnyVideoProvider implements VideoProvider {
  readonly name = 'bunny';
  private readonly logger = new Logger(BunnyVideoProvider.name);

  getPlaybackSource(
    file: PlayableFile,
    opts?: PlaybackOptions,
  ): PlaybackSource {
    const host = process.env.BUNNY_CDN_HOSTNAME;
    if (!host) {
      this.logger.warn(
        'VIDEO_PROVIDER=bunny but BUNNY_CDN_HOSTNAME is not set; serving stored URL.',
      );
      return {
        url: file.url,
        provider: this.name,
        quality: file.quality,
        expiresAt: null,
      };
    }

    const path = this.normalizePath(file.storagePath ?? file.url);
    const base = `https://${host}${path}`;

    const tokenKey = process.env.BUNNY_TOKEN_KEY;
    if (!tokenKey) {
      return {
        url: base,
        provider: this.name,
        quality: file.quality,
        expiresAt: null,
      };
    }

    const ttl = opts?.ttlSeconds ?? 3600;
    const expires = Math.floor(Date.now() / 1000) + ttl;
    const ipStr = opts?.clientIp ? opts.clientIp : '';
    
    const token = createHash('md5')
      .update(tokenKey + path + expires + ipStr)
      .digest('base64')
      .replace(/\n/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const ipParam = opts?.clientIp ? `&token_path_ip=${opts.clientIp}` : '';

    return {
      url: `${base}?token=${token}&expires=${expires}${ipParam}`,
      provider: this.name,
      quality: file.quality,
      expiresAt: new Date(expires * 1000),
    };
  }

  private normalizePath(pathOrUrl: string): string {
    try {
      // If a full URL was stored, keep only its path.
      const u = new URL(pathOrUrl);
      return u.pathname;
    } catch {
      return pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    }
  }
}
