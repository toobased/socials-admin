import { makeAutoObservable } from "mobx"
import { SocialPost } from "../social/post"

export class ActionExtra {
    post?: SocialPost
    video?: SocialPost

    constructor(p: Partial<ActionExtra> = {}) {
        Object.assign(this, p)
        if (p.post) { this.post = new SocialPost(p.post) }
        if (p.video) { this.video = new SocialPost(p.video) }
        makeAutoObservable(this)
    }

    with_post(p: SocialPost) { this.post = p; return this }
}
