import { SocialAttachmentType, SocialPhoto } from "@/models/social/attachments";
import { observer } from "mobx-react";
import { Image } from '@chakra-ui/react'

export const SocialAttachmentView = observer((p: {attachment: SocialAttachmentType}) => {
    const { attachment } = p
    return (
        <div>
            {attachment.SocialPhoto &&
                <SocialPhotoView photo={attachment.SocialPhoto} />
            }
        </div>
    )
})

export const SocialPhotoView = observer((p: {photo: SocialPhoto}) => {
    const { photo } = p
    const mainSize = photo.sizes[photo.sizes.length - 1]
    return (
        <div>
          <Image
            className="rounded-lg max-w-md"
            src={mainSize.url}
          />
        </div>
    )
})
