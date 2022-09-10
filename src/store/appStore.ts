import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import appApi from "@/api/app";
import { AppInfo } from "@/models/app";
import { successMessageChakra } from "@/utils";

class AppModalsState {
  add_source =  false
  add_source_platform = false

  constructor() { makeAutoObservable(this) }

  setAddSource (v: boolean) { this.add_source = v }
  setAddSourcePlatform (v: boolean) { this.add_source_platform = v }
}

export class AppStore {
  modals = new AppModalsState();
  testField: string = "test field?";
  commonInfo?: AppInfo;

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
