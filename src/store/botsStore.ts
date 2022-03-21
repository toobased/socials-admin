import botsApi from "@/api/bots";
import { BotCreate, BotInterface, BotSearch, BotSearchQuery, GenderEnum } from "@/models/bots";
import { simpleProcessResponse } from "@/utils";
import { AxiosResponse } from "axios";
import { makeAutoObservable, observable } from "mobx";
import { createContext } from "react";

export class BotStoreLoaders {
  botCreationLoading: boolean = false
  currentBotLoading: boolean = false

  setBotCreationLoading(isLoading: boolean) {
      this.botCreationLoading = isLoading
  }

  setCurrentBotLoading(isLoading: boolean) {
      this.currentBotLoading = isLoading
  }

  constructor () {
    makeAutoObservable(this)
  }
}

export class BotStoreErrors {
  currentBotError: string = ""

  setCurrentBotError(error: string) {
    this.currentBotError = error
  }

  constructor () {
    makeAutoObservable(this)
  }
}

/*
const testBot = new BotCreate()
testBot.username = "79782215509"
testBot.password = "sometestpassword"
testBot.gender = GenderEnum.male
*/

export class BotStore {
 // newBot: BotCreate = testBot;
 newBot: BotCreate = new BotCreate();
 currentBot?: BotInterface;
 bots?: BotInterface[];
 botSearch?: BotSearch;
 botSearchQuery: BotSearchQuery = new BotSearchQuery();
 loaders: BotStoreLoaders = new BotStoreLoaders();
 errors: BotStoreErrors = new BotStoreErrors();
 currentPage: number = 1;
 botsLoading: boolean = false;
 botsLoadingError: boolean = false;

 constructor () {
   makeAutoObservable(this)
 }

 setNewBot(newBot: BotCreate) {
  this.newBot = newBot
 }
 resetNewBot() {
   this.newBot = new BotCreate()
 }

 setCurrentBot(bot: BotInterface) {
   this.currentBot = bot
 }
 removeCurrentBot() {
   this.currentBot = undefined
 }

 setBots (bots: BotInterface[]) {
   this.bots = bots
 }
 setBotSearch (botSearch: BotSearch) {
   this.botSearch = botSearch
 }
 setBotSearchQuery (botSearchQuery: BotSearchQuery) {
   this.botSearchQuery = botSearchQuery
 }
 /*
 setNewBot (newBot: BotCreate) {
   this.newBot = newBot
 }
 */
 setCurrentPage (page: number) {
   this.currentPage = page
 }
 setBotsLoading (isLoading: boolean) {
   this.botsLoading = isLoading
 }

 async createBotApi (): Promise<[boolean, string]> {
   console.log('run create bot', this.newBot)
   // this.loaders.botCreationLoading = true
   this.loaders.setBotCreationLoading(true)
   try {
     const response: AxiosResponse = 
      await botsApi.createBot(this.newBot)
      return simpleProcessResponse(
        response,
        "bot created",
        "error while creating bot"
      )
   } catch(error) {
       return [false, `${error}`]
       // throw console.error('createBotApi error', error)
   } finally {
     this.loaders.setBotCreationLoading(false)
   }
 }

 async getBotsApi (replace: boolean = false) {
   // return null
   if (this.botsLoading) {
     return
   }
   if (this?.botSearch?.bots && !replace) {
     return
   }
   this.setBotsLoading(true)
   this.botsLoadingError = false
   try {
     const botSearch: BotSearch = await botsApi.getBots(
       this.botSearchQuery
     )
     this.setBotSearch(botSearch)
   } catch (error) {
     this.botsLoadingError = true
     throw console.log('error while search bots', error)
   } finally {
     this.setBotsLoading(false)
   }
 }

 async getBotApi (id: string) {
   if (this.loaders.currentBotLoading) {
     return
   }
   this.loaders.setCurrentBotLoading(true)
   this.removeCurrentBot()
   this.errors.setCurrentBotError('')
   try {
     const resp: AxiosResponse = await botsApi.getBot(id)
     const [isSuccess, msg] = simpleProcessResponse(resp)
     if (isSuccess) {
       this.setCurrentBot(resp.data)
     } else {
       this.errors.setCurrentBotError(`${msg}`)
     }
   } catch (error) {
     this.errors.setCurrentBotError(`${error}`)
   } finally {
     this.loaders.setCurrentBotLoading(false)
   }
 }

 async deleteBotApi (id: string): Promise<[boolean, string]> {
   try {
     const resp: AxiosResponse = 
      await botsApi.deleteBot(id)
     return simpleProcessResponse(
       resp,
       "bot deleted",
       "error while deleting bot"
     )
   } catch (error) {
     return [false, `${error}`]
   } finally {
   }
 }

 async updateBotApi (): Promise<[boolean, string]> {
   try {
     const resp: AxiosResponse = 
      await botsApi.updateBot(this.newBot)
     return simpleProcessResponse(
       resp,
       "bot updated",
       "error while updating bot"
     )
   } catch (error) {
     return [false, `${error}`]
   } finally {
   }
 }

}

export const BotContext = createContext<BotStore>(new BotStore())
