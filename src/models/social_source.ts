import { PlatformEnum } from "./enums/bots";

export class SourcePlatformInfo {
  platform: PlatformEnum = PlatformEnum.Unspecified;
  source_link: string = '';

  constructor(p: Partial<SourcePlatformInfo> = {}) {
    Object.assign(this, p)
  }
}

export class SocialSource {
  id: string = '';
  avatar: string = '';
  name: string = '';
  description: string = '';
  platforms: SourcePlatformInfo[] = [];

  constructor(p: Partial<SocialSource> = {}) {
    Object.assign(this, p)
  }
}
