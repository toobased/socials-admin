import { IFilterValue } from "@/models/bots"
import { Menu, MenuItemOption, MenuList, MenuOptionGroup } from "@chakra-ui/react"
import { Icon } from "@iconify/react"
import { observer } from "mobx-react"
import SelectMenuButton from "./SelectMenuButton"
import ServerCallLabel from "./ServerCallLabel"
import SimpleLabel from "./SimpleLabel"

interface OptionDropdownFilderProps {
  filterLabel: string
  showServerLabel?: boolean
  currentRaw?: any | undefined
  currentFilter: IFilterValue | undefined
  onValueSelect: Function
  filterValues: IFilterValue[]
}

const OptionDropdownFilter = observer(({
  filterLabel = 'filter label',
  showServerLabel = true,
  currentRaw = undefined,
  currentFilter,
  onValueSelect,
  filterValues
}: OptionDropdownFilderProps) => {
  return (
    <>
    <SimpleLabel label={filterLabel} />
    <Menu>
      <SelectMenuButton 
        inner={
          <>
            <div className="flex gap-2 justify-between min-w-[120px]">
              <div className="flex gap-2 items-center">
                <Icon 
                  icon={currentFilter?.icon ?? ''} 
                  color={currentFilter?.iconColor ?? ''}
                  width="20"
                />
                <div> 
                  {currentFilter?.label}
                </div>
              </div>
              {showServerLabel &&
                <div>
                  <ServerCallLabel />
                </div>
              }
            </div>
          </>
        }
      />
      <MenuList>
        <MenuOptionGroup
          type="radio"
          value={currentRaw}
          onChange={(value) => {
            if (typeof value == 'string') {
              onValueSelect(value)
            }
          }}
        >
          {filterValues.map((item,index) =>
            <MenuItemOption
              key={index}
              value={`${item.query_value}`}
            >
              <div className="flex items-center gap-3">
                <Icon 
                  icon={item.icon ?? ''} 
                  color={item.iconColor ?? ''}
                  width="20"
                />
                <div className="font-semibold text-md">
                  { item.label }
                </div>
              </div>
            </MenuItemOption>
          )}
        </MenuOptionGroup>
      </MenuList>
    </Menu>

    </>
  )
})

export default OptionDropdownFilter
