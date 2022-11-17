import { DbFindResult } from "@/models/api";
import { SocialPost } from "@/models/social/post";
import { SocialSource } from "@/models/social_source";
import { AxiosResponse } from "axios";
import HttpClient from "./client";
import { Result } from "./models/base";
import { GetPostByUrlQuery } from "./models/social";

const prefixUrl = '/social'

class SocialApi extends HttpClient{

  public getPostByUrl = async (q: GetPostByUrlQuery)
    :Promise<AxiosResponse<Result<SocialPost>>> => {
    const response: AxiosResponse<Result<SocialPost>> = await this.client.post(
      `${prefixUrl}/get_post_by_url`, q
    )
    return response
  }
}

const socialApi = new SocialApi()
export default socialApi
