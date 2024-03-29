import { makeAutoObservable } from "mobx";
import { createContext } from "react"; import appApi from "@/api/app"; import { AppInfo } from "@/models/app";
import { successMessageChakra } from "@/utils";
import { useColorMode, useColorModePreference, useColorModeValue } from "@chakra-ui/react";

class AppModalsState {
    add_source =  false
    create_task = false
    create_bot = false
    edit_bot = false
    add_source_platform = false

    constructor() { makeAutoObservable(this) }

    setAddSource (v: boolean) { this.add_source = v }
    setAddSourcePlatform (v: boolean) { this.add_source_platform = v }
    setCreateTask (v: boolean) { this.create_task = v }
    setCreateBot (v: boolean) { this.create_bot = v }
    setEditBot (v: boolean) { this.edit_bot = v }
}

enum AppTheme { Dark = "dark", Light = "light" }
class AppPrefs {
    theme = AppTheme.Dark

    constructor() { makeAutoObservable(this) }
    init () {
        const t = localStorage.getItem('chakra-ui-color-mode') as AppTheme || this.currentTheme
        this.setTheme(t)
    }

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
    timestamp_now: number = new Date().getTime()
    modals = new AppModalsState();
    testField: string = "test field?";
    commonInfo?: AppInfo;
    prefs: AppPrefs = new AppPrefs()

    setNow(v: number) { this.timestamp_now = v }
    spawnUpdateInterval () { setInterval(() => this.setNow(new Date().getTime()), 1000) }

  constructor() {
      makeAutoObservable(this)
      this.spawnUpdateInterval()
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

  get isMobile () { return window.innerWidth < 768 }

}

export const AppContext = createContext<AppStore>(new AppStore())
