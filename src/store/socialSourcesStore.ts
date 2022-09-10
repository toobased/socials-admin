import botsTasksApi from "@/api/botsTasks";
import sourceApi from "@/api/socialSources";
import { appCore } from "@/core/core";
import { DbFindResult } from "@/models/api";
import { BotTask, BotTasksSearchQuery } from "@/models/bots_tasks";
import { SocialSource, SocialSourceCreate, SourcePlatformInfo } from "@/models/social_source";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";

class SocialSourcesLoaders {
    getSources: boolean = false;
    getSource: boolean = false;
    getTasks: boolean = false;
    createSource: boolean = false;
    deleteSource: boolean = false;
    updateSource: boolean = false;

    constructor() { makeAutoObservable(this) }

    setGetSources(v: boolean) { this.getSources = v }
    setGetSource(v: boolean) { this.getSource = v }
    setGetTasks(v: boolean) { this.getTasks = v }
    setCreateSource(v: boolean) { this.createSource = v }
    setDeleteSource(v: boolean) { this.deleteSource = v }
    setUpdateSource(v: boolean) { this.updateSource = v }
}

export class SocialSourcesStore {
    loaders: SocialSourcesLoaders =  new SocialSourcesLoaders();
    sourcesSearch: DbFindResult<SocialSource> = new DbFindResult();
    currentSource: SocialSource = new SocialSource();
    currentTasks: DbFindResult<BotTask> = new DbFindResult();
    newSource: SocialSourceCreate = new SocialSourceCreate()
    newSourcePlatform: SourcePlatformInfo = new SourcePlatformInfo()

    constructor() { makeAutoObservable(this) }

    async getSources () {
        this.loaders.setGetSources(true)
        try {
            const result = await sourceApi.getSources()
            this.sourcesSearch = result.data
        } catch {
        } finally {
            this.loaders.setGetSources(false)
        }
    }

    async getSourceTasks () {
        if (!this.currentSource || this.currentSource.id == '') { return }
        this.loaders.setGetTasks(true)
        try {
            const query = new BotTasksSearchQuery({
                source_id: this.currentSource.id
            })
            const result = await botsTasksApi.getBotTasks(
                query.getQuery()
            )
            this.currentTasks = result.data
        } catch {
        } finally {
            this.loaders.setGetTasks(false)
        }
    }

    async getSource (id: string) {
        this.loaders.setGetSource(true)
        try {
            const result = await sourceApi.getSource(id)
            this.currentSource = new SocialSource(result.data)
        } catch {
        } finally {
            this.loaders.setGetSource(false)
        }
    }

    async createSource (s: SocialSourceCreate) {
        this.loaders.setCreateSource(true)
        try {
            await sourceApi.createSource(s)
        } catch {
        } finally {
            this.loaders.setCreateSource(false)
        }
    }

    async updateGetCurrent () {
      if (!this.currentSource) { return }
      await this.updateSource(this.currentSource)
      await this.getSource(this.currentSource.id)
    }

    async updateSource (s: SocialSource) {
        this.loaders.setUpdateSource(true)
        try {
            const source = new SocialSourceCreate({...s})
            await sourceApi.updateSource(source)
        } catch {
        } finally {
            this.loaders.setUpdateSource(false)
            appCore.notify.update()
        }
    }

    async deleteSource (s: SocialSource) {
        this.loaders.setDeleteSource(true)
        try {
            await sourceApi.deleteSource(s.id)
        } catch (e) {
            console.log('tst error while deleting:', e)
        } finally {
            this.loaders.setDeleteSource(false)
        }
    }
}


export const SourceStoreContext = createContext<SocialSourcesStore>(
  new SocialSourcesStore()
)
