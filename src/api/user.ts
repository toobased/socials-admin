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

  public loginGetAccessToken = async (
    username: string,
    password: string,
    auth_type: string = "password"
  ): Promise<Record<string,any>> => {
    const formData = new FormData()
    formData.append("username", username)
    formData.append("password", password)
    formData.append("auth_type", auth_type)
    const { data } = await this.client.post(
      '/users/token',
      formData
    );
    return data
  }

}

const api = new UserApi()
export default api
