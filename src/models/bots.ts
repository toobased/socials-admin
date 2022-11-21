import botsApi from "@/api/bots";
import { ChooseItem } from "@/components/common/ChooseContainer";
import { makeAutoObservable } from "mobx";
import { ActionFormConfig, ActionFormField, ActionFormFieldType } from "./action_form";
import { CountryEnum, PlatformEnum } from "./enums/bots";
import { TaskActionType, TaskTarget } from "./enums/bot_tasks";
import { BaseDate } from "./utils";

export enum BotStatus {
    Configure = 'Configure', Ready = 'Ready',
    Resting = 'Resting', InUse = 'InUse',
    Banned = 'Banned', ActionRequired = 'ActionRequired',
    Error = 'Error'
}

export class BotPlatformData {
    refresh_token: string | null = null;
    expires_in: string | null = null;
    constructor(props: Partial<BotPlatformData> = {}) { Object.assign(this, props) }
}

export class BotExtra {
    notes: string | null = null;
    constructor(props: Partial<BotExtra> = {}) { Object.assign(this, props) }
}

export enum BotErrorKind {
    Dummy = 'Dummy', Common = 'Common',
    Auth = 'Auth', Access = 'Access', Ban = 'Ban' }
export class BotError {
    kind!: BotErrorKind
    msg: string = ''
    detail_msg: string = ''
    constructor(props: Partial<BotError> = {}) { Object.assign(this, props) }
}

export class Bot {
    id!: string;
    social_id: string = '';
    username: string = '';
    password: string = '';
    access_token: string | null = null;
    // times
    date_created!: BaseDate;
    date_updated!: BaseDate;
    last_used: BaseDate | null = null;
    rest_until: BaseDate | null = null;
    // eof times
    platform!: PlatformEnum;
    status!: BotStatus;
    created_source: string | null = null;
    platform_data: BotPlatformData = new BotPlatformData();
    extra: BotExtra = new BotExtra();
    error: BotError | null = null;
    gender: GenderEnum = GenderEnum.Unknown;

    constructor(p: Partial<Bot> = {}) {
        Object.assign(this, p)
        p.date_created && (this.date_created = new BaseDate(p.date_created))
        p.date_updated && (this.date_updated = new BaseDate(p.date_updated))
        p.last_used && (this.last_used = new BaseDate(p.last_used))
        p.rest_until && (this.rest_until = new BaseDate(p.rest_until))
        makeAutoObservable(this)
    }

    static async fetchByAccessToken(p: PlatformEnum, t: string) {
        return await botsApi.fetchByAccessToken({platform: p, access_token: t})
    }
}

export class BotCreate {
  social_id: string = "";
  username: string = "";
  password: string = "";
  access_token: string = "";
  platform: PlatformEnum = PlatformEnum.Unspecified;
  created_source: string | null = null;
  make_ready: boolean = false;
  gender: GenderEnum = GenderEnum.Male;
  rest_until: BaseDate | null = null;
  rest_secs: number | null = null

  constructor(params: Partial<BotCreate> = {}) {
    makeAutoObservable(this)
    Object.assign(this, params)
  }

  canBeCreated () {
    if (
      // (this.username.trim().length != 11)  ||
      // (this.password.trim().length < 6) ||
      (!this.platform) ||
      (!this.gender)
    ) {
      return false
    }
    return true
  }

    reset () { Object.assign(this, new BotCreate()); return this }
    withPlatform (p: PlatformEnum) { this.platform = p; return this }
    withAccessToken (v: string) { this.access_token = v; return this }

  form_config () {
    const fields: ActionFormField[] = [
      {
        field_type: ActionFormFieldType.InputString,
        label: 'Username (phone)',
        placeholder: '+7 (xxx) ...',
        value: () => this.username,
        setter: (v: any) => { this.username = v }
      },
      {
        field_type: ActionFormFieldType.InputString,
        label: 'Пароль',
        placeholder: 'xxx',
        value: () => this.password,
        setter: (v: any) => { this.password = v }
      },
      {
        field_type: ActionFormFieldType.DatePicker,
        label: 'Сколько боту отлеживаться',
        placeholder: 'xxx',
        value: () => this.rest_secs,
        setter: (v: any) => {
            this.rest_secs = v
            this.rest_until = BaseDate.from_secs(v)
        }
      },
    ]
    return new ActionFormConfig({ fields })
  }

}

export interface BotSearch {
    total: number;
    bots: Bot[];
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

export function filtersToChooseItems(f: IFilterValue[], exclude_all = false): ChooseItem[] {
    if (exclude_all) { f = f.filter(v => v.label.toLowerCase() != "all") }
    return f.map(v => {
        return {
            value: v.query_value,
            title: v.label,
            icon: v.icon,
            iconColor: v.iconColor
        } as ChooseItem
    })
} 


export enum GenderEnum {
  Male = "Male",
  Female = "Female",
 Unknown = "Unknown"
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

const c = {
    red: '#dc2626',
    blue: '#1d4ed8',
    violet: '#6d28d9',
    orange: '#ea580c'
}

export const platformFilters: IFilterValue[] = [
  { label: "All", query_value: '', icon: 'bxs:select-multiple', iconColor: 'black'},
  { label: PlatformEnum.Vk, query_value: PlatformEnum.Vk, icon: 'cib:vk', iconColor: '#4C75A3' },
  { label: PlatformEnum.Ok, query_value: PlatformEnum.Ok, icon: 'fa:odnoklassniki-square', 
      iconColor: '#ed812b' },
  { label: PlatformEnum.Instagram, query_value: PlatformEnum.Instagram, icon: 'ant-design:instagram-filled', iconColor: '#8a3ab9'},
  { label: PlatformEnum.Youtube, query_value: PlatformEnum.Youtube, icon: 'ant-design:youtube-filled', iconColor: '#FF0000'},
  { label: PlatformEnum.Dzen, query_value: PlatformEnum.Dzen, icon: 'brandico:yandex-rect', iconColor: '#171717'},
]

export const actionFilters: IFilterValue[] = [
  { label: TaskActionType.Dummy, query_value: TaskActionType.Dummy, icon: 'bxs:select-multiple', iconColor: '#4C75A3' },
  { label: TaskActionType.Like, query_value: TaskActionType.Like, icon: 'icon-park-solid:like', iconColor: c.red },
  { label: TaskActionType.Watch, query_value: TaskActionType.Watch, icon: 'akar-icons:eye', iconColor: c.blue },
  { label: TaskActionType.Repost, query_value: TaskActionType.Repost, icon: 'bx:share', iconColor: c.violet },
]

export const targetFilters: IFilterValue[] = [
  { label: TaskTarget.Post, query_value: TaskTarget.Post, icon: 'mdi:post-it-note-edit', iconColor: c.red },
  { label: TaskTarget.Group, query_value: TaskTarget.Group, icon: 'ph:package-fill', iconColor:  c.orange },
  { label: TaskTarget.User, query_value: TaskTarget.User, icon: 'mdi:user', iconColor: c.violet },
  { label: TaskTarget.Video, query_value: TaskTarget.Video, icon: 'material-symbols:video-camera-back-outline-rounded', iconColor: c.red },
  { label: TaskTarget.Dummy, query_value: TaskTarget.Dummy, icon: '', iconColor: '' },
]

export const genderFilters: IFilterValue[] = [
  { label: "All", query_value: '',
  icon: 'bxs:select-multiple'},
  { label: "male", query_value: GenderEnum.Male,
    icon: 'noto:boy-light-skin-tone'
  },
  { label: "female", query_value: GenderEnum.Female, 
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
