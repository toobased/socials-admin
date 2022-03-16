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

/*
export class Bot implements BotInterface {
  id: string = "";
  username: string = "";
  password: string = "";
  access_token: string = "";
  created_time: string | Date = "";
  created_source: string = "";
  last_used: string | Date = "";
  is_active: boolean = false;
  is_in_use: boolean = false;
  like_count: number = 0;
  reply_count: number = 0;
  comment_count: number = 0;
  platform?: PlatformEnum;
  gender?: GenderEnum;
  constructor(props: Record<string,any>) {
    Object.assign(this, props)
  }
}
*/

export class BotCreate {
  id: string = "";
  username: string = "";
  password: string = "";
  access_token: string = "";
  is_active: boolean = false;
  is_in_use: boolean = false;
  platform: PlatformEnum = PlatformEnum.vk;
  gender: GenderEnum = GenderEnum.male;

  constructor(params: any = {}) {
    makeAutoObservable(this)
    Object.assign(this, params)
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
  is_active?: number | null;
  is_in_use?: number | null;
  platform?: PlatformEnum | string;
  gender?: GenderEnum | string;
}

export class BotSearchQuery {
  limit: number = 10;
  offset: number = 0;
  is_active?: number | string = '';
  is_in_use?: number | string = '';
  platform?: PlatformEnum | string = '';
  gender?: GenderEnum | string = '';

  constructor(params: BotSearchQueryInterface = {}) {
    Object.assign(this, params);
    makeAutoObservable(this)
  }

  getQuery(): BotSearchQueryInterface {
    return Object.fromEntries(
    Object.entries(this).filter(
      (([_, v]) => 
        v != ''
      )) 
    ) as BotSearchQueryInterface
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
  { label: "All", query_value: ''},
  { label: "vk", query_value: PlatformEnum.vk},
  { label: "instagram", query_value: PlatformEnum.instagram},
]

export const genderFilters: IFilterValue[] = [
  { label: "All", query_value: ''},
  { label: "male", query_value: GenderEnum.male},
  { label: "female", query_value: GenderEnum.female},
]

export const activeFilters: IFilterValue[] = [
  { label: "All", query_value: ''},
  { label: "Only active", query_value: 1},
  { label: "Only not active", query_value: 0},
]

export const inUseFilters: IFilterValue[] = [
  { label: "All", query_value: ''},
  { label: "Only in use", query_value: 1},
  { label: "Only not in use", query_value: 0},
]
