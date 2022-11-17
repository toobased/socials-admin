import { SocialPost } from "@/models/social/post";
import { Input } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { SocialAttachmentView } from "./SocialAttachment";

export const SocialPostView = observer((p: {post: SocialPost}) => {
    const { post } = p
    return (
        <div>
            <div className="">
                <div className="max-w-xl">
                    <Input
                      className="mt-1"
                      placeholder={'Post text is here'}
                      value={post.text}
                      disabled={true}
                      onChange={(e) => {
                        post.setText(e.target.value)
                      }}
                    />
                </div>
                <div>
                    <SocialAttachmentView attachment={post.attachments[0]} />
                </div>
            </div>
        </div>
    )
})
