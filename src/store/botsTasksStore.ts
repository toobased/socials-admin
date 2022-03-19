import botsTasksApi from "@/api/botsTasks";
import { CreateBotTask } from "@/models/bots_tasks";
import { simpleProcessResponse } from "@/utils";
import { AxiosResponse } from "axios";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class BotTaskStoreLoaders {
  currentBotTaskLoading: boolean = false;
  botTaskCreationLoading: boolean = false;

  setCurrentBotTaskLoading(l: boolean) {
    this.currentBotTaskLoading = l
  }

  setBotTaskCreationLoading(l: boolean) {
    this.botTaskCreationLoading = l
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export class BotTasksStoreErrors {
  taskCreationError?: string

  setTaskCreationError(error: any) {
    const e = JSON.stringify(error)
    this.taskCreationError = e 
  }
  removeTaskCreationError() {
    this.taskCreationError = undefined
  }

  constructor () {
    makeAutoObservable(this)
  }
}

export class BotTasksStore {
  newTask: CreateBotTask = new CreateBotTask();
  loaders: BotTaskStoreLoaders = new BotTaskStoreLoaders();
  errors: BotTasksStoreErrors = new BotTasksStoreErrors();

  setNewTask(newTask: CreateBotTask) {
    this.newTask = newTask
  }
  resetNewTask() {
    this.newTask = new CreateBotTask()
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
