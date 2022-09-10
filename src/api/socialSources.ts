import { DbFindResult } from "@/models/api";
import { SocialSource, SocialSourceCreate } from "@/models/social_source";
import { AxiosResponse } from "axios";
import HttpClient from "./client";

const prefixUrl = '/social_sources'

class SourceApi extends HttpClient{

  public getSources = async (): Promise<AxiosResponse<DbFindResult<SocialSource>>> => {
    const response: AxiosResponse = await this.client.get(
      `${prefixUrl}/`,
    )
    return response
  }

  public getSource = async (id: string): Promise<AxiosResponse<SocialSource>> => {
    const response: AxiosResponse = await this.client.get(
      `${prefixUrl}/${id}`,
    )
    return response
  }

  public createSource = async (source: SocialSourceCreate):
    Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.client.post(
      `${prefixUrl}/`,
       source
    )
    return response
  }

  public updateSource = async (source: SocialSourceCreate):
    Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.client.patch(
      `${prefixUrl}/${source.id}`,
       source
    )
    return response
  }

  public deleteSource = async (id: string):
    Promise<AxiosResponse> => {
    const response: AxiosResponse = await this.client.delete(
      `${prefixUrl}/${id}`,
    )
    return response
  }
}

const sourceApi = new SourceApi()
export default sourceApi
