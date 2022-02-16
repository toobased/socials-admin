import { Bot } from "@/models/bots";
import HttpClient from "./client";

class BotsApi extends HttpClient{
  public getBots = async (): Promise<Bot> => {
    const { data } = await this.client.get<Bot>(
      '/bots/'
    );
    return data
  }
}
