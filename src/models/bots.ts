import { makeAutoObservable } from "mobx";
import { CountryEnum } from "./enums/bots";

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
  is_banned: boolean;
  is_resting: boolean;
  like_count: number;
  reply_count: number;
  comment_count: number;
  country?: CountryEnum;
  platform?: PlatformEnum;
  gender?: GenderEnum;
  rest_until?: string;
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
  country: CountryEnum = CountryEnum.russia;
  rest_until?: string = undefined;

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
  query_value: string | number;
  // defautl, exclusive, is_text,
  icon?: string;
  iconColor?: string;
  isIconText?: boolean;
}

export enum PlatformEnum {
  vk = "vk",
  ok = "ok",
  instagram = "instagram",
  yt = "youtube"
}

export enum GenderEnum {
  male = "male",
  female = "female"
}

const fIcons = {
    all: 'bxs:select-multiple',
    country: {
      russia: 'emojione-v1:flag-for-russia',
      belarus: 'emojione-v1:flag-for-belarus',
      china: 'emojione-v1:flag-for-china',
      usa: 'emojione-v1:flag-for-united-states'
    }
}

export const platformFilters: IFilterValue[] = [
  { label: "All", query_value: '', icon: 'bxs:select-multiple', iconColor: 'black'},
  { label: "vk", query_value: PlatformEnum.vk, icon: 'cib:vk', iconColor: '#4C75A3' },
  { label: "ok", query_value: PlatformEnum.ok, icon: 'fa:odnoklassniki-square', 
      iconColor: '#ed812b' },
  { label: "instagram", query_value: PlatformEnum.instagram, icon: 'ant-design:instagram-filled', iconColor: '#8a3ab9'},
  { label: "youtube", query_value: PlatformEnum.yt, icon: 'ant-design:youtube-filled', iconColor: '#FF0000'},
]

export const genderFilters: IFilterValue[] = [
  { label: "All", query_value: '',
  icon: 'bxs:select-multiple'},
  { label: "male", query_value: GenderEnum.male,
    icon: 'noto:boy-light-skin-tone'
  },
  { label: "female", query_value: GenderEnum.female, 
    icon: 'noto-v1:girl-light-skin-tone'
  },
]

export const activeFilters: IFilterValue[] = [
  { label: "All", query_value: '', icon: fIcons.all},
  { label: "Only active", query_value: 1,
      icon: 'twemoji:green-circle'
  },
  { label: "Only not active", query_value: 0,
      icon: 'twemoji:red-circle'
  },
]

export const inUseFilters: IFilterValue[] = [
  { label: "All", query_value: '', icon: fIcons.all},
  { label: "Only in use", query_value: 1, 
    icon: 'twemoji:green-circle'
  },
  { label: "Only not in use", query_value: 0,
    icon: 'twemoji:red-circle'
  },
]

export const countryFiltes: IFilterValue[] = [
  {label: 'Russia', query_value: CountryEnum.russia,
  icon: fIcons.country.russia},
  {label: 'Belarus', query_value: CountryEnum.belarus,
  icon: fIcons.country.belarus},
  {label: 'China', query_value: CountryEnum.china,
  icon: fIcons.country.china},
  {label: 'USA', query_value: CountryEnum.usa,
  icon: fIcons.country.usa},
]
