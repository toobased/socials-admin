import { CreateBotTask } from "@/models/bots_tasks";
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

export class BotTasksStore {
  newTask: CreateBotTask = new CreateBotTask();
  loaders: BotTaskStoreLoaders = new BotTaskStoreLoaders();

  setNewTask(newTask: CreateBotTask) {
    this.newTask = newTask
  }
  resetNewTask() {
    this.newTask = new CreateBotTask()
  }
}


export const BotTasksContext = createContext<BotTasksStore>(
  new BotTasksStore()
)
