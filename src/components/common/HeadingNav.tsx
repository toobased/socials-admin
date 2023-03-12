import { Icon } from "@iconify/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { isCurrentPage, MenuItem, menuItems } from "../NavSidebar"
import ThemeSwitcher from "./ThemeSwitcher"

export const MainMenuItemCard: React.FC<{
    item: MenuItem,
}> = ({item}) => {
    const router = useRouter()
    const isCurrent = isCurrentPage(item, router)
    const style = {
        backgroundColor: isCurrent ? '#4bddea': ''
    }
    return (
        <Link href={item.path} passHref>
            <div
                style={style}
                className="py-1 px-4 cursor-pointer flex items-center rounded-lg hover:opacity-60 select-none gap-2"
            >
                {item.icon &&
                    <Icon icon={item.icon} width="18px"/>
                }
                <span className="text-sm">
                    { item.name }
                </span>
            </div>
        </Link>
    )
}

export const MainMenuItems = () => {
    return (
        <div className="flex border-t py-2 justify-center gap-2 sticky top-0 z-10 flex-1">
            {menuItems.map((item: MenuItem, index: number) =>
                <MainMenuItemCard
                    key={index}
                    item={item}
                />
            )}
        </div>
    )
}

const HeadingNav = () => {
  const router = useRouter()
  if (router.route == '/') {
    return <></>
  }

  return (
    <div className="flex justify-between overflow-x-scroll">
        <MainMenuItems />
        <ThemeSwitcher />
    </div>
  )
}

export default HeadingNav
