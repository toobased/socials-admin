import { makeAutoObservable } from "mobx";
import { LikeAction } from "./actions/like";

import { WatchAction } from "./actions/watch";
import { ActionFormConfig } from "./action_form";
import { PlatformEnum } from "./enums/bots";
import { BotTaskStatusEnum, TaskDurationTypeEnum, TaskActionType, WorkLagEnum, TaskTarget } from "./enums/bot_tasks";
import { SocialSource } from "./social_source";
import { RegularLikeGroupTargetData } from "./tasks_regular_like";
import { WatchVideoTargetData } from "./tasks_watch_video";
import { BaseDate } from "./utils";

export enum SortOrder {
  ascending = 1,
  descending = -1
}

export interface ITaskDateFinish {
    date: string
}

export class LikePostResultMetrics {
    like_count: number = 0
    constructor(params?: any) {
        Object.assign(this, params)
    }
    get metricsLabel (): string {
        return `${this.like_count}`
    }
}

export class WatchVideoResultMetrics {
    watch_count: number = 0
    constructor(params?: any) {
        Object.assign(this, params)
    }
    get metricsLabel (): string {
        return `${this.watch_count}`
    }
}

export class BotTaskTypeTarget {
  target!: TaskTarget
  platforms: Array<PlatformEnum> = []

  construct (p: Partial<BotTaskType>) {
    Object.assign(this, p)
  }
}

export class BotTaskType {
  id!: string
  action_type!: TaskActionType
  name!: string
  description!: string
  targets: Array<BotTaskTypeTarget> = []
  is_active!: boolean

  construct (p: Partial<BotTaskType>) {
    Object.assign(this, p)
  }
}

export class TaskDateFinish {
  date: string = ''
    // TODO: change to normal Date / parsing ?
  constructor () {
    makeAutoObservable(this)
  }
}

export class LikePostTargetData {
    post_link: string = ''
    like_count?: number = 0
    work_lag?: WorkLagEnum = WorkLagEnum.five_minutes
    date_finish: TaskDateFinish = new TaskDateFinish()

    constructor(params: any = {}) {
        makeAutoObservable(this)
        Object.assign(this, params)
    }

    get metricsLabel (): string {
        return `${this.like_count}`
    }

    isValid(): boolean {
      if (
        (this.post_link == '') ||
        !(this.like_count) ||
        (this.like_count < 1) ||
        !(this.work_lag) ||
        !(Object.values(WorkLagEnum).includes(this.work_lag))
      ) {
        return false
      }
      if (
        (this.work_lag === WorkLagEnum.custom_date) &&
        (!(this.date_finish) ||
        (this.date_finish.date === ''))
      ) {
        return false
      }
      return true
    }
}

export interface ITaskTargetData {
    like_post?: LikePostTargetData
    regular_like_group?: RegularLikeGroupTargetData
    watch_video?: WatchVideoTargetData
}

export class TaskTargetData implements ITaskTargetData {
    like_post?: LikePostTargetData = new LikePostTargetData()
    regular_like_group?: RegularLikeGroupTargetData = new RegularLikeGroupTargetData()
    watch_video?: WatchVideoTargetData = new  WatchVideoTargetData()

    constructor(params: any = {}) {
      const { like_post } = params
      const { regular_like_group } = params
      const { watch_video } = params
      Object.assign(this, params)
      this.like_post = new LikePostTargetData(like_post)
      this.regular_like_group = new RegularLikeGroupTargetData(regular_like_group)
      this.watch_video = new WatchVideoTargetData(watch_video)
      makeAutoObservable(this)
    }

    metricsLabel(tType: TaskActionType): string {
        if (tType == TaskActionType.Like && this.like_post) {
            return this.like_post.metricsLabel
        }
        if (tType == TaskActionType.Watch && this.watch_video) {
            return this.watch_video.metricsLabel
        }
        return ''
    }

}

export interface ITaskResultMetrics {
    like_post: LikePostResultMetrics
    watch_video: WatchVideoResultMetrics
}

export class TaskResultMetrics implements TaskResultMetrics {
    like_post: LikePostResultMetrics = new LikePostResultMetrics()
    watch_video: WatchVideoResultMetrics = new WatchVideoResultMetrics()

    constructor(props?: ITaskResultMetrics) {
        Object.assign(this, props)
        if (props) {
            this.like_post = new LikePostResultMetrics(props.like_post)
            this.watch_video = new WatchVideoResultMetrics(props.watch_video)
        }
        makeAutoObservable(this)
    }

    metricsLabel (tType: TaskActionType): string {
        if (tType == TaskActionType.Like) {
            return this.like_post.metricsLabel
        }
        if (tType == TaskActionType.Watch) {
            return this.watch_video.metricsLabel
        }
        return ''
    }
}

export enum TaskErrorKind {
    Db = 'Db',
    IncorrectData = 'IncorrectData',
    ActionError = 'ActionError',
    Dummy = 'Dummy',
    NotImplemented = 'NotImplemented'
}

/** Bot task error class */
export class TaskError {
  kind: TaskErrorKind = TaskErrorKind.Dummy;
  msg: string = '';
  detail_msg: string = '';

  constructor(p: Partial<BotTaskOptions> = {}) {
    Object.assign(this, p)
  }
}

export class BotTaskOptions {
  delete_after_finished: boolean = false;
  is_hidden: boolean = false;
  is_testing: boolean = false;
  is_browser: boolean = false;

  constructor(p: Partial<BotTaskOptions> = {}) {
    Object.assign(this, p)
  }
}

export class TaskActionEnum {
  LikeAction: LikeAction | undefined = undefined
  WatchAction: WatchAction | undefined = undefined

  constructor() {
    makeAutoObservable(this)
  }

    form_config(t: TaskActionType): ActionFormConfig | undefined {
        const T = TaskActionType
        switch (t) {
            case T.Watch: return this.WatchAction?.form_config()
            case T.Like: return this.LikeAction?.form_config()
        }
        return undefined
    }

  from_action_type(t: TaskActionType) {
    Object.assign(this, new TaskActionEnum())
    const T = TaskActionType
    switch (t) {
      case T.Watch:
        this.WatchAction = new WatchAction()
        break
      case T.Like:
        this.LikeAction = new LikeAction()
        break
    }
  }

  setTarget(t: TaskTarget) {
    if (this.LikeAction) {
      this.LikeAction.target = t
    }
    if (this.WatchAction) {
      this.WatchAction.target = t
    }
  }

  get target (): TaskTarget | undefined {
    if (this.WatchAction) { return this.WatchAction.target }
    if (this.LikeAction) { return this.LikeAction.target }
    return undefined
  }
}

/** Bot task class */
export class BotTask {
  id: string = '';
  is_active: boolean = false;
  status: BotTaskStatusEnum = BotTaskStatusEnum.Active;
  created_date?: BaseDate;
  updated_date?: BaseDate;
  next_run_timestamp: BaseDate | null = null;
  title: string = '';
  platform?: PlatformEnum;
  options: BotTaskOptions = new BotTaskOptions();
  error: TaskError | null = null;
  action_type: TaskActionType = TaskActionType.Dummy;
  action!: TaskActionEnum;
  social_source: SocialSource | null = null;

  // TODO? bots_used: string[] = [];

  constructor(params: Partial<BotTask>) {
      Object.assign(this, params)
      makeAutoObservable(this)
  }

  get metricsLabel (): string {
    const at = this.action_type
    return `${at}`
    // return `${tM}/${tD} <br/> ${bL} bots used`
  }
}


/** Create bot task class 
 * it is auto observed
* */
export class CreateBotTask {
    is_active: boolean = true;
    title: string = '';
    platform: PlatformEnum = PlatformEnum.Vk;
    is_testing: boolean = false;
    action_type: TaskActionType = TaskActionType.Dummy;
    action: TaskActionEnum = new TaskActionEnum();
    social_source_id: string | null = null;

    constructor(p: Partial<CreateBotTask> = {}) {
        makeAutoObservable(this)
        Object.assign(this, p)
    }

    isValid (): boolean {
    return true
      let v = false
      if (
        !(Object.values(PlatformEnum).includes(this.platform)) ||
        !(this.action_type) ||
        !(Object.values(TaskActionType).includes(this.action_type))
      ) {
        return false
      }
      return v
    }

    assign (t: Partial<BotTask>) {
      Object.assign(this, t)
    }

    reset () { Object.assign(this, new CreateBotTask()) }
}


export interface IBotTasksSearch {
  bot_tasks: BotTask[];
  total: number;
}

export class BotTasksSearch {
  bot_tasks: BotTask[] = []
  total: number = 0

  constructor(params?: IBotTasksSearch) {
    // Object.assign(this, params)
    makeAutoObservable(this)
    if (params == undefined) {
    } else {
        this.total = params.total
        this.setTasks(params.bot_tasks)
    }
  }

    setTasks (botTasks: BotTask[], replace: boolean = true) {
        if (replace) {  this.bot_tasks = [] }
        botTasks.forEach((task) =>
            this.bot_tasks.push(new BotTask(task))
        )
    }
}

export class BotTasksSearchQuery {
  skip: number = 0;
  limit: number = 10;
  source_id: string | undefined = undefined;
  platform?: PlatformEnum = undefined;
  task_type?: TaskActionType = undefined;
  is_active?: boolean = undefined;
  status?: BotTaskStatusEnum = undefined;
  include_hidden: boolean = false;
  sort_by_created_date: SortOrder = SortOrder.descending;
  sort_by_updated_date?: SortOrder = undefined;

  constructor(params: Partial<BotTasksSearchQuery> = {}) {
      Object.assign(this, params)
      makeAutoObservable(this)
  }

  getQuery(): any {
    return Object.fromEntries(
    Object.entries(this).filter(
      (([_, v]) => 
        v != ''
      )) 
    ) as any 
  }

  resetDefaults () {
    Object.assign(this, new BotTasksSearchQuery())
  }

}

export interface CountableMetrics {
}
