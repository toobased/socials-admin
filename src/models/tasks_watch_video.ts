import { makeAutoObservable } from "mobx"
import { TaskDateFinish } from "./bots_tasks"
import { WorkLagEnum } from "./enums/bot_tasks"

export class WatchVideoTargetData {
  // video link
  video_link: string = ""
  // how much views need to
  watch_count: number =  4
  // how long each view to watch a video
  watch_second: number = 20
  // minimum time for task processing
  work_lag: WorkLagEnum = WorkLagEnum.five_minutes
  // custom task date finish
  date_finish: TaskDateFinish = new TaskDateFinish()

  constructor(params: any = {}) {
    Object.assign(this, params)
    makeAutoObservable(this)
  }

    isValid(): boolean {
      if (
        (this.video_link.trim().length == 0) ||
        (this.watch_count < 4) ||
        (this.watch_second > 1800) ||
        !(Object.values(WorkLagEnum).includes(this.work_lag))
      ) {
        return false
      }
      return true
    }

}
