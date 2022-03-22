import botsTasksApi from "@/api/botsTasks";
import { BotTasksSearch, BotTasksSearchQuery, CreateBotTask, IBotTask, IBotTaskSearch } from "@/models/bots_tasks";
import { simpleProcessResponse } from "@/utils";
import { AxiosResponse } from "axios";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class BotTaskStoreLoaders {
  currentBotTaskLoading: boolean = false;
  botTaskCreationLoading: boolean = false;
  botTasksLoading: boolean = false;
  deleteBotTaskLoading: boolean = false;
  updateBotTaskLoading: boolean = false;
  botTaskLoading: boolean = false;

  setCurrentBotTaskLoading(l: boolean) {
    this.currentBotTaskLoading = l
  }

  setBotTaskCreationLoading(l: boolean) {
    this.botTaskCreationLoading = l
  }

  setBotTasksLoading (l: boolean) {
      this.botTasksLoading = l
  }

  setDeleteBotTaskLoading (l: boolean) {
      this.deleteBotTaskLoading = l
  }

  setUpdateBotTaskLoading (l: boolean) {
      this.deleteBotTaskLoading = l
  }

  setBotTaskLoading (l: boolean) {
    this.botTaskLoading = l
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export class BotTasksStoreErrors {
  taskCreationError?: string
  tasksLoadingError?: string
  taskLoadingError?: string
  taskUpdateError?: string

  setTaskCreationError(error: any) {
    const e = JSON.stringify(error)
    this.taskCreationError = e 
  }
  setTasksLoadingError(error: any) {
    const e = JSON.stringify(error)
    this.tasksLoadingError = e 
  }

  setTaskLoadingError(error: any) {
    const e = JSON.stringify(error)
    this.taskLoadingError = e 
  }

  setTaskUpdateError(error: any) {
    const e = JSON.stringify(error)
    this.taskUpdateError = e 
  }

  removeTaskCreationError() {
    this.taskCreationError = undefined
  }

  removeTasksLoadingError() {
    this.tasksLoadingError = undefined
  }

  removeTaskLoadingError() {
    this.taskLoadingError = undefined
  }

  removeTaskUpdateError() {
    this.taskLoadingError = undefined
  }

  constructor () {
    makeAutoObservable(this)
  }
}

export class BotTasksStore {
  currentTask?: IBotTask;
  newTask: CreateBotTask = new CreateBotTask();
  loaders: BotTaskStoreLoaders = new BotTaskStoreLoaders();
  errors: BotTasksStoreErrors = new BotTasksStoreErrors();
  tasksSearch: BotTasksSearch = new BotTasksSearch();
  tasksSearchQuery: BotTasksSearchQuery = new BotTasksSearchQuery();
  currentPage: number = 1;

  constructor () {
    makeAutoObservable(this)
  }

  setCurrentPage (p: number) {
    this.currentPage = p
  }

  setNewTask(newTask: CreateBotTask) {
    this.newTask = newTask
  }

  setCurrentTask(t: IBotTask) {
    console.log('run set current task')
    this.currentTask = t
    console.log('run set current task', this.currentTask)
  }

  removeCurrentTask() {
    this.currentTask = undefined
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

  async deleteBotTaskApi (id: string): Promise<[boolean, string]> {
    this.loaders.setDeleteBotTaskLoading(true)
    try {
      const resp: AxiosResponse = await botsTasksApi.deleteBotTask(id)
      const [isSuccess, msg] = simpleProcessResponse(
          resp, 
          'task deleted',
          'error while deleting task'
      )
      return [isSuccess,msg]
    } catch (error) {
      return [false, `${error}`]
    } finally {
      this.loaders.setDeleteBotTaskLoading(false)
    }
  }

  async updateBotTaskApi (): Promise<[boolean, string]> {
    if (this.loaders.updateBotTaskLoading) {
      return [false, 'wait, its in pending state already']
    }
    this.loaders.setUpdateBotTaskLoading(true)
    this.errors.removeTaskUpdateError()
    try {
      const resp: AxiosResponse = await botsTasksApi.updateBotTask(
        Object.assign(this.currentTask, this.newTask)
      )
      const [isSuccess, msg] = simpleProcessResponse(
          resp, 
          'task updated',
          'error while updating task'
      )
      return [isSuccess,msg]
    } catch (error) {
      return [false, `${error}`]
    } finally {
      this.loaders.setUpdateBotTaskLoading(false)
    }
  }

  async getBotTaskByIdApi (id: string) {
    if (this.loaders.currentBotTaskLoading) {
      return
    }
    this.errors.removeTaskLoadingError()
    this.removeCurrentTask()
    this.loaders.setBotTaskLoading(true)
    try {
      const resp: AxiosResponse = await botsTasksApi.getBotTaskById(id)
      const [isSuccess, msg] = simpleProcessResponse(
          resp, 
          '',
          'error while loading task'
      )
      !isSuccess && this.errors.setTaskLoadingError(msg)
      if (isSuccess) {
        const currentTask: IBotTask = resp.data
        this.setCurrentTask(currentTask)
      }
    } catch (error) {
      this.errors.setTaskLoadingError(error)
    } finally {
      this.loaders.setBotTaskLoading(false)
    }
  }

}


export const BotTasksContext = createContext<BotTasksStore>(
  new BotTasksStore()
)
