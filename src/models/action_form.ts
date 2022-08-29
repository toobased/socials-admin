export enum ActionFormFieldType {
  InputNumber,
  InputString
}

export class ActionFormField {
  field_type!: ActionFormFieldType
  label: string = ''
  hint?: string | null = null
  placeholder: string = ''
  value: any
  setter!: Function

  constructor(p: Partial<ActionFormField>) {
    Object.assign(this, p)
  }
}

export class ActionFormConfig {
  fields: Array<ActionFormField> = []

  constructor(p: Partial<ActionFormConfig>) {
    Object.assign(this, p)
  }
}
