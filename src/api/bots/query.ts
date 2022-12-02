import { PlatformEnum } from "@/models/enums/bots"

export interface CheckBotByTokenQuery {
    platform: PlatformEnum,
    access_token: string
}
