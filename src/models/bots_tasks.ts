import { WatchVideoCreateBlock } from "@/components/tasks_data/watch_video";
import { makeAutoObservable } from "mobx";
import { PlatformEnum } from "./enums/bots";
import { BotTaskStatusEnum, TaskDurationTypeEnum, TaskTypeEnum, WorkLagEnum } from "./enums/bot_tasks";
import { RegularLikeGroupTargetData } from "./tasks_regular_like";
import { WatchVideoTargetData } from "./tasks_watch_video";

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

export interface ITaskType {
    id: string
    name: string
    description: string
    platforms: PlatformEnum[]
    duration_type: TaskDurationTypeEnum
    is_active: boolean
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

    metricsLabel(tType: TaskTypeEnum): string {
        if (tType == TaskTypeEnum.like_post && this.like_post) {
            return this.like_post.metricsLabel
        }
        return ''
    }

}

export interface ITaskResultMetrics {
    like_post: LikePostResultMetrics
}

export class TaskResultMetrics implements TaskResultMetrics {
    like_post: LikePostResultMetrics = new LikePostResultMetrics()

    constructor(props?: ITaskResultMetrics) {
        Object.assign(this, props)
        if (props) {
            this.like_post = new LikePostResultMetrics(props.like_post)
        }
        makeAutoObservable(this)
    }

    metricsLabel (tType: TaskTypeEnum): string {
        if (tType == TaskTypeEnum.like_post) {
            return this.like_post.metricsLabel
        }
        return ''
    }
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
    created_date: string;
    updated_date: string;
    next_run_timestamp?: number;
    title: string;
    platform?: PlatformEnum;
    task_type: TaskTypeEnum;
    error?: IBotTaskError;
    task_result_metrics: TaskResultMetrics
    task_target_data: TaskTargetData 
}

export class BotTask implements IBotTask {
    id: string = '';
    is_active: boolean = false;
    status: BotTaskStatusEnum = BotTaskStatusEnum.stopped;
    created_date: string = '';
    updated_date: string = '';
    next_run_timestamp?: number;
    title: string = '';
    platform?: PlatformEnum;
    task_type: TaskTypeEnum = TaskTypeEnum.dummy;
    error?: IBotTaskError;
    task_result_metrics: TaskResultMetrics = new TaskResultMetrics();
    task_target_data: TaskTargetData  = new TaskTargetData();
    bots_used: string[] = [];

    constructor(params: IBotTask) {
        Object.assign(this, params)
        this.task_result_metrics = new TaskResultMetrics(params.task_result_metrics)
        this.task_target_data = new TaskTargetData(params.task_target_data)
        makeAutoObservable(this)
    }

    get metricsLabel (): string {
        const tP = this.task_type
        const tM = this.task_result_metrics.metricsLabel(tP)
        const tD = this.task_target_data.metricsLabel(tP)
        const bL = this.bots_used.length
        return `${tM}/${tD} <br/> ${bL} bots used`
    }
}


/** Create bot task class 
 * it is auto observed
* */
export class CreateBotTask {
    title: string = '';
    platform: PlatformEnum = PlatformEnum.vk;
    task_type?: TaskTypeEnum = undefined;
    task_target_data: TaskTargetData = new TaskTargetData();
    is_active: boolean = true;
    is_testing: boolean = false;

    constructor(params: any = {}) {
        const { task_target_data } = params
        makeAutoObservable(this)
        Object.assign(this, params)
        this.task_target_data = new TaskTargetData(task_target_data)
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
      if(this.task_type == TaskTypeEnum.like_post) {
        (this.task_target_data.like_post != undefined) &&
          (v = this.task_target_data.like_post.isValid())
      }
      // validation check for regular_like_group
      if(this.task_type == TaskTypeEnum.regular_like_group) {
        (this.task_target_data.regular_like_group != undefined) &&
          (v = this.task_target_data.regular_like_group.isValid())
      }
      // validation check for watch_video
      if(this.task_type == TaskTypeEnum.watch_video) {
        (this.task_target_data.watch_video != undefined) &&
          (v = this.task_target_data.watch_video.isValid())
      }
      return v
    }

    assign (t: IBotTask) {
      Object.assign(this, t)
    }

    reset () {
      Object.assign(this, {
        title: '',
        platform: PlatformEnum.vk,
        task_type: '',
        task_target_data: new TaskTargetData()
      })
    }
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
  platform?: PlatformEnum = undefined;
  task_type?: TaskTypeEnum = undefined;
  is_active?: boolean = undefined;
  status?: BotTaskStatusEnum = undefined;
  include_hidden: boolean = false;

  constructor(params: any = {}) {
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
