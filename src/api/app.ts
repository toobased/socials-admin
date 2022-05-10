import { AppInfo } from "@/models/app";
import { AxiosError, AxiosResponse } from "axios";
import HttpClient from "./client";

class AppApi extends HttpClient{

	public getCommonInfo = async (): Promise<AppInfo> => {
		const { data } = await this.client.get<AppInfo>(
			'/site/common-info'
		);
		return data
	}
}

const api = new AppApi()
export default api
