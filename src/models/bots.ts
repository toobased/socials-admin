import { makeAutoObservable } from "mobx";

export interface BotInterface {
  id: string;
  username: string;
  password: string;
  access_token: string;
  created_time: string | Date;
  created_source: string;
  last_used: string | Date;
  is_active: boolean;
  is_in_use: boolean;
  like_count: number;
  reply_count: number;
  comment_count: number;
  platform?: PlatformEnum;
  gender?: GenderEnum;
}

export class BotCreate {
  username: string = "";
  password: string = "";
  access_token: string = "";
  is_active: boolean = false;
  is_in_use: boolean = false;
  platform: PlatformEnum = PlatformEnum.vk;
  gender?: GenderEnum | null = null;

  constructor() {
    makeAutoObservable(this)
  }

  canBeCreated () {
    if (
      (this.username.trim().length != 11)  ||
      (this.password.trim().length < 6) ||
      (!this.platform) ||
      (!this.gender)
    ) {
      return false
    }
    return true
  }

}

export interface BotSearch {
    total: number;
    bots: BotInterface[];
}


export class BotSearchQueryInterface {
  limit?: number;
  offset?: number;
  is_active?: number;
}

export class BotSearchQuery {
  limit: number = 10;
  offset: number = 0;
  is_active?: number | null = null;
  is_in_use?: number | null = null;
  platform?: PlatformEnum | null = null;
  gender?: GenderEnum | null = null;

  constructor(params: BotSearchQueryInterface = {}) {
    Object.assign(this, params);
    makeAutoObservable(this)
  }

  resetDefaults () {
    Object.assign(this, new BotSearchQuery())
  }
}

export interface IFilterValue {
  label: string;
  // if null remove from query value
  query_value?: any;
  // defautl, exclusive, is_text,
}

export enum PlatformEnum {
  vk = "vk",
  instagram = "instagram"
}

export enum GenderEnum {
  male = "male",
  female = "female"
}

export const platformFilters: IFilterValue[] = [
  { label: "All", query_value: null},
  { label: "vk", query_value: PlatformEnum.vk},
  { label: "instagram", query_value: PlatformEnum.instagram},
]

export const genderFilters: IFilterValue[] = [
  { label: "All", query_value: null},
  { label: "male", query_value: GenderEnum.male},
  { label: "female", query_value: GenderEnum.female},
]

export const activeFilters: IFilterValue[] = [
  { label: "All", query_value: null},
  { label: "Only active", query_value: 1},
  { label: "Only not active", query_value: 0},
]

export const inUseFilters: IFilterValue[] = [
  { label: "All", query_value: null},
  { label: "Only in use", query_value: 1},
  { label: "Only not in use", query_value: 0},
]
