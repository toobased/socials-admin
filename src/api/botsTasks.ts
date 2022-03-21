import { BotTasksSearchQuery, CreateBotTask } from "@/models/bots_tasks";
import { AxiosResponse } from "axios";
import HttpClient from "./client";

const prefixUrl = '/bots_tasks'

class BotsTasksApi extends HttpClient{

  public getBotTasks = async (query: BotTasksSearchQuery):
    Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.client.get(
      `${prefixUrl}/`,
      {
        params: query
      }
    )
    return response
  }

  public createBotTask = async (botTask: CreateBotTask): 
    Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.client.post(
      `${prefixUrl}/`,
      botTask
    )
    return response
  }
}

const botsTasksApi = new BotsTasksApi()
export default botsTasksApi
