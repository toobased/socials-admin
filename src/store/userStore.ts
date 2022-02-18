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
  saveUserCredentials(authToken: string) {
    localStorage.setItem("access_token", authToken)
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
      this.setUserAuthorized(false)
      this.cleanUserInfo()
			throw console.error('get user me error', error)
		}
	}

  async loginUser(username: string, password: string) {
    try {
      const data = await userApi.loginGetAccessToken(
        username, 
        password
      )
      const accessToken = data.access_token
      this.saveUserCredentials(accessToken)
      await this.getUserMe()
      if (this.user) {
        this.setUserAuthorized(true)
      } else {
        this.cleanUserInfo()
        return false
      }
      return true
    } catch (error) {
      return false
      // throw console.error('login user error', error)
    }
  }

}

export const UserContext = createContext<UserStore>(new UserStore())
// export default new User();
