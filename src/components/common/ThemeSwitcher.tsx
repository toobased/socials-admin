import { AppContext } from "@/store/appStore"
import { Button, useColorMode } from "@chakra-ui/react"
import { observer } from "mobx-react"
import { useContext } from "react"

const ThemeSwitcher = observer(() => {
    const { toggleColorMode } = useColorMode()
    const appStore = useContext(AppContext)
    return (
        <div className="flex items-center max-w-max px-4 py-2 rounded-lg">
            <Button onClick={() => { appStore.prefs.toggleTheme(); toggleColorMode() } }>
                <div>theme is { appStore.prefs.currentTheme }</div>
            </Button>
        </div>
    )
})

export default ThemeSwitcher
