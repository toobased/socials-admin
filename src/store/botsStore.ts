import botsApi from "@/api/bots";
import { Bot } from "@/models/bots";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class BotStore {
 bots?: Bot[];
 botsLoading: boolean = false;

 constructor () {
   makeAutoObservable(this)
 }

  setBots (bots: Bot[]) {
   this.bots = bots
 }
 setBotsLoading (isLoading: boolean) {
   this.botsLoading = isLoading
 }

 async getBotsApi () {
   this.setBotsLoading(true)
   try {
     const bots = await botsApi.getBots()
     this.setBots(bots)
   } catch (error) {
     throw console.log('error while get bots', error)
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
