import botsApi from "@/api/bots";
import { DbFindResult } from "@/models/api";
import { BotCreate, Bot, BotSearch, BotSearchQuery, GenderEnum } from "@/models/bots";
import { simpleProcessResponse } from "@/utils";
import { AxiosResponse } from "axios";
import { makeAutoObservable, observable } from "mobx";
import { createContext } from "react";

export class BotStoreLoaders {
  botCreationLoading: boolean = false
  currentBotLoading: boolean = false
  checkBannedLoading: boolean = false

  setBotCreationLoading(isLoading: boolean) {
      this.botCreationLoading = isLoading
  }

  setCurrentBotLoading(isLoading: boolean) {
      this.currentBotLoading = isLoading
  }

  setCheckBannedLoading(isLoading: boolean) {
      this.checkBannedLoading = isLoading
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
 currentBot?: Bot;
 bots?: Bot[];
 botSearch?: DbFindResult<Bot>;
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

 setNewFromBase(base: Bot) {
 }

 resetNewBot() {
   this.newBot = new BotCreate()
 }

 setCurrentBot(bot: Bot) {
   this.currentBot = bot
 }
 removeCurrentBot() {
   this.currentBot = undefined
 }

 setBots (bots: Bot[]) {
   this.bots = bots
 }
 setBotSearch (r: DbFindResult<Bot>) { this.botSearch = r }
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
   if (this.botSearch?.items && !replace) {
     return
   }
   this.setBotsLoading(true)
   this.botsLoadingError = false
   try {
     const r = await botsApi.getBots(this.botSearchQuery)
     this.setBotSearch(r)
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
    const id = this.currentBot?.id
    if (!id) { return [false, 'no current bot id']}
     const resp: AxiosResponse =
      await botsApi.updateBot(id, this.newBot)
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

 async checkBannedApi (id: string): Promise<[boolean, string]> {
   if (this.loaders.checkBannedLoading) {
     return [false, 'already requesting']
   }
   this.loaders.setCheckBannedLoading(true)
   try {
     const resp: AxiosResponse = 
      await botsApi.checkBotBanned(id)
     return simpleProcessResponse(
       resp,
       "checked",
       "error while checking"
     )
   } catch (error) {
     return [false, `${error}`]
   } finally {
       this.loaders.setCheckBannedLoading(false)
   }
 }

}

export const BotContext = createContext<BotStore>(new BotStore())
