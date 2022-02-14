import { User } from "@/models/user";
import { AxiosResponse } from "axios";
import HttpClient from "./client";

class UserApi extends HttpClient{

	public getUserMe = async (): Promise<User> => {
		const { data } = await this.client.get<User>(
			'/users/me'
		);
		return data 
	}

}

const api = new UserApi()
export default api
