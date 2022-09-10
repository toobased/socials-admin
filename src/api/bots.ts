import { DbFindResult } from "@/models/api";
import { Bot, BotCreate, BotSearch, BotSearchQuery } from "@/models/bots";
import { AxiosResponse } from "axios";
import HttpClient from "./client";

class BotsApi extends HttpClient{
  public getBots = async (
    query: BotSearchQuery = new BotSearchQuery()
  ): Promise<DbFindResult<Bot>> => {
    const { data } = await this.client.get<DbFindResult<Bot>>(
      '/bots/', { params: query.getQuery() }
    );
    return data
  }

  public getBot = async (id: string): Promise<AxiosResponse> => {
    const resp = await this.client.get(`/bots/${id}`);
    return resp
  }

  public checkBotBanned = async (id: string): 
    Promise<AxiosResponse> => {
      const resp = await this.client.get(`bots/${id}/check_banned` );
      return resp
  }

  public deleteBot = async (id: string): Promise<AxiosResponse> => {
    const resp: AxiosResponse = await this.client.delete<AxiosResponse>(
      `/bots/${id}`
    ); return resp
  }

  public createBot = async (bot: BotCreate): Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.client.post(
      `/bots/`, bot);
    return response
  }

  public updateBot = async (id: string, bot: BotCreate): Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.client.patch(
      `/bots/${id}`, bot);
    return response
  }
}

const botsApi = new BotsApi()
export default botsApi
