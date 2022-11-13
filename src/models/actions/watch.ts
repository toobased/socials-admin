import { ActionDataFormStep } from "@/components/tasks/create/steps/data";
import { CreateTaskStep } from "@/components/tasks/CreateTaskModal";
import { makeAutoObservable } from "mobx";
import { ActionFormConfig, ActionFormField, ActionFormFieldType } from "../action_form";
import { TaskTarget } from "../enums/bot_tasks";

export class WatchTargetData {
  watch_count: number = 0;
  watch_seconds: number = 0;
  resource_link: string = '';
  time_spread: number = 0;

  constructor(p: Partial<WatchTargetData> = {}) {
    makeAutoObservable(this)
    Object.assign(this, p)
  }
}

export class WatchStats {
  watched_count: number = 0;
  constructor(p: Partial<WatchTargetData> = {}) {
    Object.assign(this, p)
  }
}

export class WatchAction {
  target: TaskTarget = TaskTarget.Dummy;
  data: WatchTargetData = new WatchTargetData();
  stats: WatchStats = new WatchStats();

  constructor(p: Partial<WatchAction> = {}) {
    makeAutoObservable(this)
    Object.assign(this, p)
  }

    get metricsLabel () {
        const n = this.data.watch_count
        const d = this.stats.watched_count
        return `${d}/${n}`
    }

    withTarget (target: TaskTarget) { this.target = target; return this }

    // actionDataStep () { return (ActionDataFormStep()) }
    // actionDataStep = ActionDataFormStep

  form_config () {
    const fields: ActionFormField[] = [
      {
        field_type: ActionFormFieldType.InputString,
        label: 'Resource link',
        placeholder: 'https://...',
        value: () => this.data.resource_link,
        setter: (v: any) => { this.data.resource_link = v }
      },
      {
        field_type: ActionFormFieldType.InputNumber,
        label: 'Watch count',
        placeholder: '10',
        value: () => this.data.watch_count,
        setter: (v: any) => { this.data.watch_count = v }
      },
      {
        field_type: ActionFormFieldType.InputNumber,
        label: 'Watch seconds',
        placeholder: '30',
        value: () => this.data.watch_seconds,
        setter: (v: any) => this.data.watch_seconds = v
      },
      {
        field_type: ActionFormFieldType.InputNumber,
        label: 'Time spread',
        placeholder: '30',
        value: () => this.data.time_spread,
        setter: (v: any) => this.data.time_spread = v
      },
    ]
    return new ActionFormConfig({ fields })
  }

}
