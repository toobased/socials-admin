import { Bot } from "@/models/bots";
import HttpClient from "./client";

class BotsApi extends HttpClient{
  public getBots = async (): Promise<Array<Bot>> => {
    const { data } = await this.client.get<Array<Bot>>(
      '/bots/'
    );
    return data
  }
  public getBot = async (id: string): Promise<Bot> => {
    const { data } = await this.client.get<Bot>(
      `/bots/${id}`
    );
    return data
  }
}

const botsApi = new BotsApi()
export default botsApi
