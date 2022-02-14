import { User } from "@/models/user";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import userApi from "@/api/user"

export class UserStore {
	authToken?: string;
	isUserAuthorized: boolean = false;
	user?: User;

	constructor() {
		makeAutoObservable(this)
	}
	// setters
	setAuthToken(newToken: string) {
		this.authToken = newToken;
	}
	setUser(user: User) {
		this.user = user;
	}
	setUserAuthorized(isAuthorized: boolean) {
		this.isUserAuthorized = isAuthorized
	}
	// removers
	cleanUserInfo() {
		this.user = undefined
		this.setUserAuthorized(false)
		this.authToken = undefined
		localStorage.removeItem("access_token")
	}
	// api calls
	async checkUserAuthorized() {
		const token = localStorage.getItem("access_token")
		if (token) {
			this.setAuthToken(token)
			await this.getUserMe()
			if (this.user) {
				this.setUserAuthorized(true)
			} else {
				this.cleanUserInfo()
			}
		}
	}
	async getUserMe() {
		try {
			const user: User = await userApi.getUserMe()
			this.setUser(user)
		} catch (error) {
			throw console.error('get user me error', error)
		}
	}

}

export const UserContext = createContext<UserStore>(new UserStore())
// export default new User();
