import { AppContext } from "@/store/appStore";
import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import SubMenu from "antd/lib/menu/SubMenu";
import { observer } from "mobx-react";
import Link from "next/link";
import { NextRouter } from "next/router";
import { useContext } from "react";

export interface MenuItem {
    key: string;
    name: string;
    path: string;
    icon?: string;
    children: MenuItem[];
}

export function isCurrentPage(
    page: MenuItem,
    router: NextRouter 
): boolean { return page.path === router.route }

export const menuItems: MenuItem[] = [
  {
    key: "1",
    name: "Главная",
    path: "/",
    icon: "ant-design:home-filled",
    children: []
  },
    /*
  {
   key: "3",
    name: "Таргеты",
    path: "/social_sources",
    icon: "bx:target-lock",
    children: []
  },
*/
  {
   key: "4",
    name: "Боты",
    path: "/bots",
    icon: "bxs:bot",
    children: []
  },
  {
   key: "5",
    name: "Таски ботов",
    path: "/bot_tasks",
    icon: "fluent:clipboard-task-list-ltr-24-filled",
    children: []
  },
    /*
  {
   key: "6",
    name: "Playground",
    path: "/playground",
    icon: "fluent:clipboard-task-list-ltr-24-filled",
    children: []
  },
    */
]

const getCurrentMenuBlock = (item: any) => {
  if (item.children && item.children.length > 0) {
    return (
      <SubMenu key={item.key} title={item.name}>
        <Menu.ItemGroup title={item.name}>
          { item.children.map((item: any) =>
            getCurrentMenuBlock(item)
          )}
        </Menu.ItemGroup>
      </SubMenu>
    )
  } else {
    return (
      <Menu.Item key={item.key}>
        <Link href={item.path}>
        { item.name }
        </Link>
      </ Menu.Item>
    )
  }
}

const getMenuItems = (items: Array<any>) => {
  return (
    <>
    {items.map((item) =>
      getCurrentMenuBlock(item)
    )}
    </>
  )
}

const NavSidebar = observer(() => {
    const appStore = useContext(AppContext)
  return (
    <>
      <Sider
        collapsible
        trigger={null}
        collapsed={false}
      >
        <Menu
          theme={appStore.prefs.currentTheme}
          mode="vertical"
        >
          { getMenuItems(menuItems) }
        </Menu>
      </Sider>
    </>
  );
})

export default NavSidebar
