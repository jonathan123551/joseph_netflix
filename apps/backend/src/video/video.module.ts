import { Global, Module } from '@nestjs/common';
import { VIDEO_PROVIDER } from './video-provider.interface';
import { LocalVideoProvider } from './local-video.provider';
import { BunnyVideoProvider } from './bunny-video.provider';

@Global()
@Module({
  providers: [
    LocalVideoProvider,
    BunnyVideoProvider,
    {
      provide: VIDEO_PROVIDER,
      inject: [LocalVideoProvider, BunnyVideoProvider],
      useFactory: (local: LocalVideoProvider, bunny: BunnyVideoProvider) =>
        process.env.VIDEO_PROVIDER === 'bunny' ? bunny : local,
    },
  ],
  exports: [VIDEO_PROVIDER],
})
export class VideoModule {}
