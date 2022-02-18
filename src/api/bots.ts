import { Bot, BotSearch } from "@/models/bots";
import HttpClient from "./client";

class BotsApi extends HttpClient{
  public getBots = async (): Promise<BotSearch> => {
    const { data } = await this.client.get<BotSearch>(
      '/bots/',
      {
        params: {
          limit: 5
        }
      }
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
