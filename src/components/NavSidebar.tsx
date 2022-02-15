import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import SubMenu from "antd/lib/menu/SubMenu";

const MenuItems: Array<any> = [
  {
    key: "1",
    name: "Home",
    path: "/",
    children: []
  },
  {
    key: "2",
    name: "Vk",
    path: "/",
    children: [
      {
        key: "2-1",
        name: "Bots",
        path: "/",
        children: []
      }
    ]
  },
  {
    key: "3",
    name: "Instagram",
    path: "/",
    children: [
    ]
  },
]

const getCurrentMenuBlock = (item: any) => {
  console.log('item is', item)
  if (item.children && item.children.length > 0) {
    console.log('is greater')
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
    console.log('is less')
    return (
      <Menu.Item key={item.key}>
        { item.name }
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

const NavSidebar = () => {
  return (
    <>
      <Sider
        collapsible
        trigger={null}
        collapsed={false}
      >
        <Menu
          theme="dark"
          mode="vertical"
        >
          { getMenuItems(MenuItems) }
        </Menu>
      </Sider>
    </>
  );
}


export default NavSidebar
