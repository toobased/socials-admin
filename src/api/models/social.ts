import { PlatformEnum } from "@/models/enums/bots";

export interface GetPostByUrlQuery {
    platform: PlatformEnum,
    url: string
}
