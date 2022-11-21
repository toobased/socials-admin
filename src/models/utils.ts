import { makeAutoObservable } from "mobx"

export class BaseDate {
    secs_since_epoch!: number
    nanos_since_epoch!: number

    // timestamp_now: number = new Date().getTime();
    // from_secs_value?: number

    constructor(p: Partial<BaseDate>) {
        makeAutoObservable(this)
        Object.assign(this, p)
        // this.init()
    }

    static from_secs(v: any) {
        const r = new Date().getTime() + parseInt(v)
        return new BaseDate({
            secs_since_epoch: r,
            nanos_since_epoch: 0,
            // from_secs_value: v
        })
    }

    // init() { this.spawnUpdateInterval() }
    // setNow(v: number) { this.timestamp_now = v }
    // spawnUpdateInterval () { setInterval(() => this.setNow(new Date().getTime()), 1000) }
    //
    get toDate (): Date { return new Date(this.secs_since_epoch * 1000) }
    get normal (): string { return this.toDate.toUTCString() }

    elapsed_sweety (timestamp_now: number): string {
        const f = (v: number) => v.toFixed(0)
        let [ day, hrs, min, sec ] = [0,0,0,0]
        const run = this.toDate.getTime()
        const left = timestamp_now - run
        if (left > 0) {
            day = (left / 1000 / 60 / 60 / 24)
            hrs = (left / 1000 / 60 / 60 % 24)
            min = (left / 1000 / 60 % 60)
            sec = (left / 1000 % 60)
        }
        let r = ''
        day >= 1 && (r = r.concat(`${f(day)}d.`))
        hrs >= 1 && (r = r.concat(`${f(hrs)}h.`))
        r = r.concat(`${f(min)}m.`)
        r = r.concat(`${f(sec)}sec.`)
        r = r.concat(' ago')
        return r
    }

    cntdwn_sweety (timestamp_now: number): string {
        const run = this.toDate.getTime()
        if (timestamp_now > run) { return 'in queue' }
        const f = (v: number) => v.toFixed(0)
        let [ day, hrs, min, sec ] = [0,0,0,0]
        const left = run - timestamp_now
        if (left > 0) {
            day = (left / 1000 / 60 / 60 / 24)
            hrs = (left / 1000 / 60 / 60 % 24)
            min = (left / 1000 / 60 % 60)
            sec = (left / 1000 % 60)
        }
        let r = ''
        day >= 1 && (r = r.concat(`${f(day)}d.`))
        hrs >= 1 && (r = r.concat(`${f(hrs)}h.`))
        r = r.concat(`${f(min)}m.`)
        r = r.concat(`${f(sec)}sec.`)
        return r
    }
}
