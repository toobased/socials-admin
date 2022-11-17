import { makeAutoObservable } from "mobx"
import { SocialAttachmentType } from "./attachments"

export class SocialPostMetric {
    count: number = 0
    user_count: number = 0
}

export class SocialPost {
    id: string = ''
    owner_id: string = ''
    post_id: string = ''
    social_delayed_id?: string
    text: string = ''
    likes: SocialPostMetric = new SocialPostMetric()
    reposts: SocialPostMetric = new SocialPostMetric()
    views: SocialPostMetric = new SocialPostMetric()
    post_type: string = ''
    // TODO
    attachments: Array<SocialAttachmentType> = []

    constructor (p: Partial<SocialPost>) { Object.assign(this, p); makeAutoObservable(this) }

    setText(t: string) { this.text = t; return this }
}
