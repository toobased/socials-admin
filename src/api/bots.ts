import { DbFindResult } from "@/models/api";
import { Bot, BotCreate, BotError, BotSearchQuery, BotUpdate } from "@/models/bots";
import { AxiosResponse } from "axios";
import { CheckBotByTokenQuery } from "./bots/query";
import HttpClient from "./client";
import { Result } from "./models/base";

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

  public updateBot = async (id: string, bot: BotUpdate): Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.client.patch(
      `/bots/${id}`, bot);
    return response
  }

  public fetchByAccessToken = async (q: CheckBotByTokenQuery)
    :Promise<AxiosResponse<Result<Bot, BotError>>> => {
    const response: AxiosResponse<Result<Bot, BotError>> = await this.client.post(
      `/bots/check_by_token`, q);
    return response
  }
}

const botsApi = new BotsApi()
export default botsApi
