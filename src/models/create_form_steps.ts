export interface CreateFormStepProps {
}

export class CreateFormStep {
    id!: string
    title: string = ''
    needConfirm: boolean = false
    isFinal: boolean = false
    Body!: () => JSX.Element

    constructor(p: Partial<CreateFormStep>) { Object.assign(this, p)}
}

export class CreateFormSteps {
    steps!: Array<CreateFormStep>
    current: CreateFormStep | null = null
    nextSetter!: (s: CreateFormStep) => void

    constructor(p: Partial<CreateFormSteps> = {}) {
        Object.assign(this, p)
    }
    setCurrent(c: CreateFormStep) { this.current = c; return this }

    withSteps (v: Array<CreateFormStep>) { this.steps = v; return this }
    init () {
        this.steps[0] && (this.current = this.steps[0])
        return this
    }
    next (id: string) {
        const cIndx = this.steps.findIndex(v => v.id == id)
        const next = this.steps[cIndx + 1]
        console.log('invoke next, next is', next)
        this.nextSetter(next)
    }
}
