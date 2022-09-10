import { action, makeAutoObservable } from "mobx";
import { PlatformEnum } from "./enums/bots";

export class SourcePlatformInfo {
  platform: PlatformEnum = PlatformEnum.Unspecified;
  source_link: string = '';

  // locale
  isEdit: boolean = false;

  constructor(p: Partial<SourcePlatformInfo> = {}) {
    makeAutoObservable(this)
    Object.assign(this, p)
  }

  setEdit (v: boolean) { this.isEdit = v }
  clear () { Object.assign(this, new SourcePlatformInfo()) }
}

export class SocialSource {
  id: string = '';
  avatar: string = '';
  name: string = '';
  description: string = '';
  platforms: SourcePlatformInfo[] = [];
  initial!: Partial<SocialSource>;

  constructor(p: Partial<SocialSource> = {}) {
    makeAutoObservable(this)
    Object.assign(this, p)
    this.platforms = []
    if (!p.platforms) { return }
    p.platforms.map(v => this.platforms.push(
      new SourcePlatformInfo(v)
    ))
  }

  setName (v: string) { this.name = v }
}

export class SocialSourceCreate {
  id: string = '';
  avatar: string = '';
  name: string = '';
  description: string = '';
  platforms: SourcePlatformInfo[] = [];

  constructor(p: Partial<SocialSourceCreate> = {}) {
    makeAutoObservable(this)
    Object.assign(this, p)
  }

  clear () { Object.assign(this, new SocialSourceCreate()) }
}
