import { CreateBotTask } from "@/models/bots_tasks";
import { AxiosResponse } from "axios";
import HttpClient from "./client";

const prefixUrl = '/bots_tasks'

class BotsTasksApi extends HttpClient{
  public createBotTask = async (botTask: CreateBotTask): 
    Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.client.post(
      `${prefixUrl}/`,
      botTask
    );
    return response
  }
}

const botsTasksApi = new BotsTasksApi()
export default botsTasksApi
