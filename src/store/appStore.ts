import { makeAutoObservable } from "mobx";
import { createContext } from "react"; import appApi from "@/api/app"; import { AppInfo } from "@/models/app";
import { successMessageChakra } from "@/utils";
import { useColorMode, useColorModePreference, useColorModeValue } from "@chakra-ui/react";

class AppModalsState {
    add_source =  false
    create_task = false
    add_source_platform = false

    constructor() { makeAutoObservable(this) }

    setAddSource (v: boolean) { this.add_source = v }
    setAddSourcePlatform (v: boolean) { this.add_source_platform = v }
    setCreateTask (v: boolean) { this.create_task = v }
}

enum AppTheme { Dark = "dark", Light = "light" }
class AppPrefs {
    theme = AppTheme.Dark

    constructor() { makeAutoObservable(this) }
    init () { this.setTheme(this.currentTheme) }

    get currentTheme() { return this.theme }

    setTheme (v: AppTheme) {
        if (!document) { return }
        this.theme = v
        const el = document.getElementById('__next')
        document.documentElement.setAttribute('class', v)
        el?.setAttribute('class', v)
    }

    toggleTheme() {
        this.currentTheme == AppTheme.Dark
        ? this.setTheme(AppTheme.Light) : this.setTheme(AppTheme.Dark)
    }
}

export class AppStore {
    modals = new AppModalsState();
    testField: string = "test field?";
    commonInfo?: AppInfo;
    prefs: AppPrefs = new AppPrefs()


  constructor() {
      makeAutoObservable(this)
  }

  async getCommonInfo () {
      try {
          const info = await appApi.getCommonInfo()
          console.log('info is', info)
          this.commonInfo = info
      } catch (error){
          throw console.error('get common info error', error)
      }
  }
  // test code, remove
  setTestField(newInfo: string) {
      this.testField = newInfo
  }

}

export const AppContext = createContext<AppStore>(new AppStore())
