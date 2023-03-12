import { Button } from "@chakra-ui/react"
import { Icon } from "@iconify/react"

export interface ChooseItem {
    icon?: string,
    iconColor?: string,
    value: any,
    title: string,
    subtitle?: string,
    description?: string,
    payload?: any
}

export interface ChooseContainerProps {
    items: ChooseItem[]
    inline?: boolean
    onChoose: (v: ChooseItem) => void
}

export const ChooseContainer = (p: ChooseContainerProps) => {
    const { items, onChoose, inline } = p
    return (
        <div>
            {!inline &&
                <div className="flex gap-3 flex-wrap">
                    {items.map((item,indx) => {
                        return (
                            <Button
                                key={indx}
                                className=""
                                leftIcon={<Icon icon={item.icon || ''} />}
                                onClick={() =>
                                    onChoose(item)}>
                                <div className="">
                                    {item.title}
                                </div>
                            </Button>
                        )
                    })}
                </div>
            }
            {inline &&
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {items.map((item,indx) => {
                    return (
                        <Button
                            variant="solid"
                            colorScheme="gray"
                            key={indx}
                            className="w-full py-8 flex items-cetner justify-start"
                            leftIcon={<Icon icon={item.icon || ''} color={item.iconColor} fontSize="1.4rem"/>}
                            onClick={() =>
                                onChoose(item)}>
                            <div className="text-lg">
                                {item.title}
                            </div>
                        </Button>
                    )
                })}
            </div>
            }
        </div>
    )
}
