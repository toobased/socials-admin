import { makeAutoObservable } from "mobx";
import { PlatformEnum } from "./enums/bots";
import { BotTaskStatusEnum, TaskTypeEnum, WorkLagEnum } from "./enums/bot_tasks";

export interface ITaskDateFinish {
    date: Date
}

export interface ILikePostResultMetrics {
    like_count: number
}

export interface ILikePostTargetData {
    post_link: string
    like_count: number
    work_lag?: WorkLagEnum
    date_finish: ITaskDateFinish
}

export class TaskDateFinish {
  date: string = ''
  constructor () {
    makeAutoObservable(this)
  }
}

export class LikePostTargetData {
    post_link: string = ''
    like_count?: number = 0
    work_lag?: WorkLagEnum = WorkLagEnum.five_minutes
    // TODO: change to Date?
    date_finish: TaskDateFinish = new TaskDateFinish()

    isValid (): boolean {
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

    constructor(params: any = {}) {
        makeAutoObservable(this)
        Object.assign(this, params)
    }
}

export interface ITaskTargetData {
    like_post?: LikePostTargetData
}

export class TaskTargetData implements ITaskTargetData {
    like_post: LikePostTargetData = new LikePostTargetData()

    initLikePost() {
        this.like_post = new LikePostTargetData()
    }

    constructor() {
        makeAutoObservable(this)
    }

}

export interface ITaskResultMetrics {
    like_post?: ILikePostResultMetrics
}
/** Bot task error class */
export interface IBotTaskError {
    error_msg: string
    detail_msg: string
}

/** Bot task class */
export interface IBotTask {
    id: string;
    is_active: boolean;
    status: BotTaskStatusEnum;
    created_date: Date;
    updated_date: Date;
    next_run_timestamp?: number;
    title: string;
    platform?: PlatformEnum;
    task_type: TaskTypeEnum;
    error?: IBotTaskError;
    task_result_metrics: ITaskResultMetrics
    task_target_data: ITaskTargetData
    // bots_used?: string[]

    /*
    constructor (
        id: string,
        is_active: boolean,
        status: BotTaskStatusEnum,
    ) {
        this.id = id
        this.is_active = is_active
        this.status = status
    }
    */
}

/** Create bot task class 
 * it is auto observed
* */
export class CreateBotTask {
    title: string = '';
    platform: PlatformEnum = PlatformEnum.vk;
    task_type?: TaskTypeEnum = undefined;
    task_target_data: TaskTargetData = new TaskTargetData();

    constructor(params: any = {}) {
        makeAutoObservable(this)
        Object.assign(this, params)
    }

    isValid (): boolean {
      let v = false
      if (
        !(Object.values(PlatformEnum).includes(this.platform)) ||
        !(this.task_type) ||
        !(Object.values(TaskTypeEnum).includes(this.task_type))
      ) {
        return false
      }
      // validation check for like_post
      (this.task_type == TaskTypeEnum.like_post) &&
        (v = this.task_target_data.like_post.isValid())
      // TODO: add validations for other types
      console.log('v is', v)
      return v
    }
}
