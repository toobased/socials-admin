import botsTasksApi from "@/api/botsTasks";
import { BotTasksSearch, BotTasksSearchQuery, CreateBotTask, IBotTaskSearch } from "@/models/bots_tasks";
import { simpleProcessResponse } from "@/utils";
import { AxiosResponse } from "axios";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class BotTaskStoreLoaders {
  currentBotTaskLoading: boolean = false;
  botTaskCreationLoading: boolean = false;
  botTasksLoading: boolean = false;

  setCurrentBotTaskLoading(l: boolean) {
    this.currentBotTaskLoading = l
  }

  setBotTaskCreationLoading(l: boolean) {
    this.botTaskCreationLoading = l
  }

  setBotTasksLoading (l: boolean) {
      this.botTasksLoading = l
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export class BotTasksStoreErrors {
  taskCreationError?: string
  tasksLoadingError?: string

  setTaskCreationError(error: any) {
    const e = JSON.stringify(error)
    this.taskCreationError = e 
  }
  setTasksLoadingError(error: any) {
    const e = JSON.stringify(error)
    this.tasksLoadingError = e 
  }

  removeTaskCreationError() {
    this.taskCreationError = undefined
  }

  removeTasksLoadingError() {
    this.tasksLoadingError = undefined
  }

  constructor () {
    makeAutoObservable(this)
  }
}

export class BotTasksStore {
  newTask: CreateBotTask = new CreateBotTask();
  loaders: BotTaskStoreLoaders = new BotTaskStoreLoaders();
  errors: BotTasksStoreErrors = new BotTasksStoreErrors();
  tasksSearch: BotTasksSearch = new BotTasksSearch();
  tasksSearchQuery: BotTasksSearchQuery = new BotTasksSearchQuery();

  setNewTask(newTask: CreateBotTask) {
    this.newTask = newTask
  }
  resetNewTask() {
    this.newTask = new CreateBotTask()
  }

  async getBotTasksApi (replace: boolean = false) {
    if (this.loaders.botTasksLoading) {
      return
    }
    if (!replace && this.tasksSearch.bot_tasks.length > 0) {
      return
    }
    console.log('continue to request')
    this.loaders.botTasksLoading = true
    try {
      const resp = await botsTasksApi.getBotTasks(this.tasksSearchQuery)
      const [isSuccess, msg] = simpleProcessResponse(
        resp, '', 'error while getting bot tasks'
      )
      const searchTasks: IBotTaskSearch = resp.data
      // TODO: improve with BotTasksSearch internall method
      replace && (this.tasksSearch.bot_tasks = searchTasks.bot_tasks)
      // TODO: fix when not replace
      !replace && 
        (this.tasksSearch.bot_tasks = 
           this.tasksSearch.bot_tasks.concat(searchTasks.bot_tasks)
        )
      this.tasksSearch.total = searchTasks.total
      if (!isSuccess) {
        this.errors.setTasksLoadingError(msg)
        return
      }
    } catch(error) {
      this.errors.setTasksLoadingError(error)
    } finally {
      this.loaders.botTasksLoading = false
    }
  }
  async createBotTaskApi (): Promise<[boolean, string]> {
    if (this.loaders.currentBotTaskLoading) {
      return [false, 'bot is creating']
    }
    this.loaders.setBotTaskCreationLoading(true)
    try {
      this.errors.removeTaskCreationError()
      const resp: AxiosResponse =
        await botsTasksApi.createBotTask(
          this.newTask
        )
      const [isValid, msg] = simpleProcessResponse(
        resp,
        "Task created",
        "Error while creating task"
      )
      !isValid && this.errors.setTaskCreationError(msg)
      return [isValid, msg]
    } catch (error) {
      this.errors.setTaskCreationError(error)
      return [false, `${error}`]
    } finally {
      this.loaders.setBotTaskCreationLoading(false)
    }
  }
}


export const BotTasksContext = createContext<BotTasksStore>(
  new BotTasksStore()
)
