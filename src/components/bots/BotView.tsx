import { Bot, BotCreate } from "@/models/bots";
import { observer } from "mobx-react";
// import { SocialAttachmentView } from "./SocialAttachment";

export const BotView = observer((p: {bot: Bot | BotCreate }) => {
    const { bot } = p
    return (
        <div>
            <div className="">
                <div className="max-w-xl">
                    {JSON.stringify(bot)}
                </div>
            </div>
        </div>
    )
})
