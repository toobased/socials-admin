import { makeAutoObservable } from "mobx"

export class BaseDate {
    private now: number = new Date().getTime();
    secs_since_epoch!: number
    nanos_since_epoch!: number

    constructor(p: Partial<BaseDate>) {
        makeAutoObservable(this)
        Object.assign(this, p)
        this.init()
    }

    init() { this.spawnUpdateInterval() }

    setNow(v: number) { this.now = v }

    spawnUpdateInterval () {
        setInterval(() => this.setNow(new Date().getTime()), 1000)
    }

    get toDate (): Date { return new Date(this.secs_since_epoch * 1000) }
    get normal (): string { return this.toDate.toUTCString() }

    get sweety (): string {
        let min, sec: string | number = 0
        const run = this.toDate.getTime()
        const left = run - this.now
        if (left > 0) {
            min = (left / 1000 / 60).toFixed(0)
            sec = (left / 1000 % 60).toFixed(0)
        }
        return `${min}m. ${sec} sec.`
    }
}
