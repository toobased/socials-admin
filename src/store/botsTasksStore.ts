import botsTasksApi from "@/api/botsTasks";
import { DbFindResult } from "@/models/api";
import { BotTasksSearchQuery, CreateBotTask, BotTask, BotTasksSearch, BotTaskType } from "@/models/bots_tasks";
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
  botTaskTypesLoading: boolean = false;

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

  setBotTaskTypesLoading (l: boolean) {
      this.botTaskTypesLoading = l
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
  taskTypesLoadingError?: string

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

  setTaskTypesLoadingError(error: any) {
    const e = JSON.stringify(error)
    this.taskTypesLoadingError = e 
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

  removeTaskTypesLoadingError() {
    this.taskTypesLoadingError = undefined
  }

  constructor () {
    makeAutoObservable(this)
  }
}

export class BotTasksStore {
  taskTypes: BotTaskType[] = [];
  currentTask?: BotTask;
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

  setCurrentTask(t: BotTask) {
    console.log('run set current task')
    this.currentTask = t
    console.log('run set current task', this.currentTask)
  }

  setTaskTypes(types: BotTaskType[]) {
    this.taskTypes = types
  }

  removeCurrentTask() {
    this.currentTask = undefined
  }

  async getTasksTypes (replace: boolean = false) {
    if (
      (!replace) &&
      (this.taskTypes) &&
      (this.taskTypes.length > 0)
    ) {
      return
    }
    if (this.loaders.botTaskTypesLoading) {
      return
    }
    this.loaders.setBotTaskTypesLoading(true)
    this.errors.removeTaskTypesLoadingError()
    try {
      const resp = await botsTasksApi.getTaskTypes()
      const [isSuccess, msg] = simpleProcessResponse(
        resp, '', 'error while getting tasks types'
      )
      const data: DbFindResult<BotTaskType> = resp.data
      if (isSuccess && data) {
        this.setTaskTypes(data.items)
      } else {
        this.errors.setTaskTypesLoadingError(msg)
      }
    } catch(error) {
        this.errors.setTaskTypesLoadingError(error)
    } finally {
      this.loaders.setBotTaskTypesLoading(false)
    }
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
      const resp = await botsTasksApi.getBotTasks(
          this.tasksSearchQuery.getQuery()
      )
      const [isSuccess, msg] = simpleProcessResponse(
        resp, '', 'error while getting bot tasks'
      )
      const searchTasks: DbFindResult<BotTask> = resp.data
      this.tasksSearch.setTasks(searchTasks.items, replace)
      // console.log(`tst tasks search are`, this.tasksSearch)
      // console.log(`tst task`, this.tasksSearch.bot_tasks[0].metricsLabel)
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
        const currentTask: BotTask = resp.data
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
