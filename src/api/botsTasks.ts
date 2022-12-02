import { BotTasksSearchQuery, CreateBotTask, BotTask } from "@/models/bots_tasks";
import { AxiosResponse } from "axios";
import HttpClient from "./client";

const prefixUrl = '/bots_tasks'

class BotsTasksApi extends HttpClient{

  public getTaskTypes = async ():
    Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.client.get(
      `/task_types/`,
    )
    return response
  }

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

  public deleteBotTask = async (id: string): 
    Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.client.delete(
      `${prefixUrl}/${id}`,
    )
    return response
  }

  public updateBotTask = async (task: BotTask): 
    Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.client.patch(
      `${prefixUrl}/${task.id}`,
      task
    )
    return response
  }

  public getBotTaskById = async (id: string): 
    Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.client.get(
      `${prefixUrl}/${id}`,
    )
    return response
  }
}

const botsTasksApi = new BotsTasksApi()
export default botsTasksApi
