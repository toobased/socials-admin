import { makeAutoObservable } from "mobx"
// import { TaskDateFinish } from "./bots_tasks"
import { WorkLagEnum } from "./enums/bot_tasks"

export class RegularLikeGroupTargetData {
  // group id
  group_id: string = ""
  // how much last posts to parse
  last_posts_check_count?: number = 0
  // frequency to parse for new posts
  check_frequency?: WorkLagEnum = WorkLagEnum.ten_minutes
  // how much like for each post
  like_count?: number = 0
  // work lag for each post like
  work_lag?: WorkLagEnum = WorkLagEnum.five_minutes

  constructor(params: any = {}) {
    Object.assign(this, params)
    makeAutoObservable(this)
  }

    isValid(): boolean {
      if (
        !(this.like_count) ||
        (this.like_count < 1) ||
        !(this.check_frequency) ||
        !(Object.values(WorkLagEnum).includes(this.check_frequency)) ||
        !(this.work_lag) ||
        !(Object.values(WorkLagEnum).includes(this.work_lag)) ||
        !(this.last_posts_check_count) ||
        (this.last_posts_check_count < 1) ||
        (this.group_id.length < 1) ||
        (this.work_lag == WorkLagEnum.custom_date) ||
        (this.check_frequency == WorkLagEnum.custom_date)
      ) {
        return false
      }
      return true
    }
}
