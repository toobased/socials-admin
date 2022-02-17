export interface Bot {
  id: string;
  username: string;
  password: string;
  access_token: string;
  created_time: string | Date;
  created_source: string;
  last_used: string | Date;
  is_active: boolean;
  is_in_use: boolean;
  like_count: number;
  reply_count: number;
  comment_count: number;
}

