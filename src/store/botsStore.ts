import botsApi from "@/api/bots";
import { Bot, BotSearch } from "@/models/bots";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class BotStore {
 bots?: Bot[];
 botSearch?: BotSearch;
 botsLoading: boolean = false;

 constructor () {
   makeAutoObservable(this)
 }

 setBots (bots: Bot[]) {
   this.bots = bots
 }
 setBotSearch (botSearch: BotSearch) {
   this.botSearch = botSearch
 }
 setBotsLoading (isLoading: boolean) {
   this.botsLoading = isLoading
 }

 async getBotsApi () {
   // return null
   this.setBotsLoading(true)
   try {
     const botSearch: BotSearch = await botsApi.getBots()
     this.setBotSearch(botSearch)
   } catch (error) {
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
