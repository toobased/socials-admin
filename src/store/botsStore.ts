import botsApi from "@/api/bots";
import { BotCreate, BotInterface, BotSearch, BotSearchQuery } from "@/models/bots";
import { makeAutoObservable, observable } from "mobx";
import { createContext } from "react";

export class BotStore {
 newBot: BotCreate = new BotCreate();
 bots?: BotInterface[];
 botSearch?: BotSearch;
 botSearchQuery: BotSearchQuery = new BotSearchQuery();
 currentPage: number = 1;
 botsLoading: boolean = false;
 botsLoadingError: boolean = false;

 constructor () {
   makeAutoObservable(this)
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
     console.log('bots search query is', this.botSearchQuery)
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
   try {
     const bot = await botsApi.getBot(id)
     return bot
   } catch (error) {
     throw console.log('error while get bot', error)
   } finally {
   }
 }
}

export const BotContext = createContext<BotStore>(new BotStore())
