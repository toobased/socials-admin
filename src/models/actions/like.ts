import { makeAutoObservable } from "mobx"
import { ActionFormConfig, ActionFormField, ActionFormFieldType } from "../action_form"
import { TaskTarget } from "../enums/bot_tasks"

export class LikeStats {
    like_count: number = 0
    processed_posts_ids: string[] = []
    bots_used: string[] = []

    constructor(p: Partial<LikeStats> = {}) { 
        Object.assign(this, p)
    }
}

export class LikeTargetData {
    like_count: number = 0
    like_random_threshold: number = 0
    last_items_check_count: number = 0
    owner_id: string = ''
    item_id: string = ''
    resource_link: string = ''
    time_spread: number = 0

    constructor(p: Partial<LikeStats> = {}) { 
        makeAutoObservable(this)
        Object.assign(this, p)
    }
}

export class LikeAction {
    target: TaskTarget = TaskTarget.Dummy
    data: LikeTargetData = new LikeTargetData()
    stats: LikeStats = new LikeStats()

    constructor(p: Partial<LikeAction> = {}) {
        makeAutoObservable(this)
        Object.assign(this, p)
    }

  form_config () {
    const fields: ActionFormField[] = [
      {
        field_type: ActionFormFieldType.InputNumber,
        label: 'Like count',
        placeholder: '3',
        value: () => this.data.like_count,
        setter: (v: any) => { this.data.like_count = v }
      },
      {
        field_type: ActionFormFieldType.InputNumber,
        label: 'Like random threshold',
        placeholder: '2',
        value: () => this.data.like_random_threshold,
        setter: (v: any) => { this.data.like_random_threshold = v }
      },
      {
        field_type: ActionFormFieldType.InputNumber,
        label: 'Time spread (seconds)',
        placeholder: '7200',
        value: () => this.data.time_spread,
        setter: (v: any) => { this.data.time_spread = v }
      },
      {
        field_type: ActionFormFieldType.InputString,
        label: 'Target link',
        placeholder: 'https://...',
        value: () => this.data.resource_link,
        setter: (v: any) => { this.data.resource_link = v }
      },
    ]
    return new ActionFormConfig({ fields })
  }
}
