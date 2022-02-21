import { Bot, BotSearch, BotSearchQuery } from "@/models/bots";
import HttpClient from "./client";

class BotsApi extends HttpClient{
  public getBots = async (
    query: BotSearchQuery = new BotSearchQuery()
  ): Promise<BotSearch> => {
    const { data } = await this.client.get<BotSearch>(
      '/bots/',
      {
        params: query
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
