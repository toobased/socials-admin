import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import appApi from "@/api/app";
import { AppInfo } from "@/models/app";

export class AppStore {
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
