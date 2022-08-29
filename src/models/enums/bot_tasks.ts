export enum BotTaskStatusEnum {
  Active = 'Active',
  Processing = 'Processing',
  Stopped = 'Stopped',
  Error = 'Error',
  Finished = 'Finished'
}

export enum TaskActionType {
  Dummy = 'Dummy',
  Like = 'Like',
  Watch = 'Watch',
  Repost = 'Repost'
}

export enum WorkLagEnum {
  immediately = 'Immediately',
  one_minute = '1 minute',
  five_minutes = '5 minutes',
  ten_minutes = '10 minutes',
  thirty_minutes = '30 minutes',
  one_hour = '1 hour',
  three_hours = '3 hours',
  one_day = '1 day',
  two_days = '2 days',
  three_days = '3 days',
  one_week = '1 week',
  one_month = 'one month',
  custom_date = 'Custom date'

}

export enum TaskDurationTypeEnum {
    finite = "finite",
    regular = "regular"
}

export enum TaskTarget {
  Dummy = 'Dummy',
  Video = 'Video',
  Post = 'Post',
  User = 'User',
  Group = 'Group'
}
