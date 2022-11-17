import { makeAutoObservable } from "mobx"

export class SocialAttachmentType {
    SocialPhoto: SocialPhoto = new SocialPhoto()
    Dummy = null

    constructor(p: Partial<SocialAttachmentType> = {}) {
        Object.assign(this, p)
        if (p.SocialPhoto) { this.SocialPhoto = new SocialPhoto(p.SocialPhoto)}
        makeAutoObservable(this)
    }
}

export class SocialPhotoSize {
    url: string = ''
    width: string = ''
    height: string = ''
}

export class SocialPhoto {
    social_id: string = ''
    sizes: Array<SocialPhotoSize> = []

    constructor(p: Partial<SocialPhoto> = {}) {
        Object.assign(this, p)
        makeAutoObservable(this)
    }
}
