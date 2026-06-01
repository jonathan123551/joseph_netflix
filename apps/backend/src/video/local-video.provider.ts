import { Injectable } from '@nestjs/common';
import {
  PlayableFile,
  PlaybackSource,
  VideoProvider,
} from './video-provider.interface';

/**
 * Default provider: serves the URL already stored on the MovieFile, unchanged.
 */
@Injectable()
export class LocalVideoProvider implements VideoProvider {
  readonly name = 'local';

  getPlaybackSource(file: PlayableFile): PlaybackSource {
    return {
      url: file.url,
      provider: this.name,
      quality: file.quality,
      expiresAt: null,
    };
  }
}
