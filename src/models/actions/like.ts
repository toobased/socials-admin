import { isErr } from "@/api/models/base"
import socialApi from "@/api/social"
import { LinkPickerStepProps } from "@/components/tasks/create/steps/data"
import { fireErr } from "@/utils"
import { makeAutoObservable } from "mobx"
import { ActionFormConfig, ActionFormField, ActionFormFieldType } from "../action_form"
import { CreateBotTask } from "../bots_tasks"
import { TaskTarget } from "../enums/bot_tasks"
import { SocialPost } from "../social/post"
import { ActionExtra } from "./base"

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
    extra: ActionExtra = new ActionExtra()

    constructor(p: Partial<LikeAction> = {}) {
        makeAutoObservable(this)
        Object.assign(this, p)
        if (p.extra) { this.extra = new ActionExtra(p.extra)}
    }

    withTarget (target: TaskTarget) { this.target = target; return this }

    get metricsLabel () {
        const n = this.data.like_count
        const d = this.stats.like_count
        return `${d}/${n}`
    }

    getPostLinkStepParams (t: CreateBotTask): LinkPickerStepProps {
        return {
            title: 'Укажи ссылку на пост',
            placeholdler: 'http://...',
            actionLabel: 'Дальше',
            value: () => this.data.resource_link,
            setter: (v: any) => this.data.resource_link = v,
            onAction: async () => {
                if (this.extra.post) {
                    console.log('tst skipping, post is there')
                    return true
                }
                console.log('tst link is', this.data.resource_link)
                const postResult = await socialApi.getPostByUrl(
                    { platform: t.platform, url: this.data.resource_link }
                )
                if (isErr(postResult)) {
                    fireErr(postResult);
                    return false
                }
                this.extra.post = new SocialPost(postResult.data.Ok)
                return true
            },
        }
    }


  form_config () {
    const fields: ActionFormField[] = [
      {
        field_type: ActionFormFieldType.SliderNumber,
        label: 'Кол-во лайков',
        placeholder: '3',
        value: () => this.data.like_count,
        min: 1,
        max: 25,
        setter: (v: any) => { this.data.like_count = v }
      },
      {
        field_type: ActionFormFieldType.SliderNumber,
        label: 'Максимальное отклонение',
        placeholder: '2',
        max: this.data.like_count / 2,
        value: () => this.data.like_random_threshold,
        setter: (v: any) => { this.data.like_random_threshold = v }
      },
      {
        field_type: ActionFormFieldType.ProcessTimePicker,
        label: 'Длительность выполнения таска',
        placeholder: '7200',
        value: () => this.data.time_spread,
        setter: (v: any) => { this.data.time_spread = parseInt(v) }
      }
    ]
    return new ActionFormConfig({ fields })
  }
}
