import { ActionFormConfig, ActionFormField, ActionFormFieldType } from "@/models/action_form"
import { BaseDate } from "@/models/utils"
import { Box, Input, NumberInput, NumberInputField, Select, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@chakra-ui/react"
import { observer } from "mobx-react"
import { useEffect } from "react"
import InfoTooltip from "../common/InfoTooltip"

export interface TaskActionFormProps {
  config: ActionFormConfig
}

const InputNumberComponent = observer((props: {field: ActionFormField}) => {
  const field = props.field
  return (
    <NumberInput
      value={field.value()}
      defaultValue={20}
      placeholder={field.placeholder}
      min={1}
      inputMode="numeric"
      onChange={(_s, n) => {
        if (isNaN(n)) { field.setter(5) } else {
          field.setter(n)
        }
      }}
    >
      <NumberInputField></NumberInputField>
    </NumberInput>
  )
})

const InputStringComponent = observer((props: {field: ActionFormField}) => {
  const field = props.field
  return (
    <Input
      className="mt-1"
            placeholder={field.placeholder}
      value={field.value()}
      disabled={false}
      onChange={(e) => {
        field.setter(e.target.value)
      }}
    />
  )
})

const SliderNumberComponent = observer((props: {field: ActionFormField}) => {
  const field = props.field
    const dv = 2
    useEffect(() => field.setter(dv), [])
  return (
    <div className="max-w-md font-semibold text-2xl">
    <div className="text-center">{field.value()}</div>
    <Slider
        aria-label='slider-ex-4'
        defaultValue={dv}
        min={field.min}
        max={field.max}
        onChange={(v) => field.setter(v)}
    >
      <SliderTrack bg='red.100'>
        <SliderFilledTrack bg='tomato' />
      </SliderTrack>
      <SliderThumb boxSize={6}>
        <Box color='tomato'/>
      </SliderThumb>
    </Slider>
    </div>
  )
})

const ProcessDurationPickerComponent = observer((props: {field: ActionFormField}) => {
  const field = props.field
    const items = [
        { l: '1 second', v: 1},
        { l: '5 seconds', v: 5},
        { l: '10 seconds', v: 10},
        { l: '20 seconds', v: 20},
        { l: '30 seconds', v: 30},
        { l: '40 seconds', v: 40},
        { l: '50 seconds', v: 50},
        { l: '1 minute', v: 60},
        { l: '2 minutes', v: 120},
        { l: '3 minutes', v: 180},
        { l: '4 minutes', v: 240},
        { l: '5 minutes', v: 300},
        { l: '6 minutes', v: 360},
        { l: '7 minutes', v: 420},
        { l: '8 minutes', v: 480},
        { l: '9 minutes', v: 540},
        { l: '10 minutes', v: 600},
        { l: '15 minutes', v: 900},
        { l: '20 minutes', v: 1800}
    ]
    useEffect(() => field.setter(items[5].v), [])
  return (
    <div className="max-w-md font-semibold text-2xl">
        <Select onChange={(v) => field.setter(v.target.value)} value={field.value()}>
            {items.map((item, indx) =>
                <option key={indx} value={item.v}>{item.l}</option>
            )}
        </Select>
    </div>
  )
})

const ProcessTimePickerComponent = observer((props: {field: ActionFormField}) => {
  const field = props.field
    const items = [
        { l: 'Instantly', v: 0},
        { l: '10 seconds', v: 10},
        { l: '1 minute', v: 60},
        { l: '2 minutes', v: 120},
        { l: '5 minutes', v: 300},
        { l: '10 minutes', v: 600},
        { l: '20 minutes', v: 1200},
        { l: '30 minutes', v: 1800},
        { l: '1 hour', v: 3600},
        { l: '2 hours', v: 7200},
        { l: '3 hours', v: 10800},
        { l: '8 hours', v: 28800},
        { l: '12 hours', v: 43200},
        { l: '1 day', v: 86400},
        { l: '2 days', v: 172800},
        { l: '3 days', v: 259200},
        { l: '4 days', v: 345600},
        { l: '1 week', v: 604800},
        { l: '2 weeks', v: 1209600},
    ]
    useEffect(() => field.setter(items[5].v), [])
  return (
    <div className="max-w-md font-semibold text-2xl">
        <Select onChange={(v) => {
            if (field.field_type == ActionFormFieldType.DatePicker) {
                field.setter(v.target.value)
                // field.setter(BaseDate.from_secs(parseInt(v.target.value)))
            } else {
                field.setter(v.target.value)
            }
        }}
        value={field.value()}>
            {items.map((item, indx) =>
                <option key={indx} value={item.v}>{item.l}</option>
            )}
        </Select>
    </div>
  )
})

export const TaskActionForm = observer((props: TaskActionFormProps) => {
  const config = props.config
  const fields = config.fields
  return (
    <div className="p-4 rounded-lg">
      {fields.map((field, index) =>
        <div key={index}>
          <div className="font-semibold text-md mb-1 flex gap-2">
            {field.label}
            <InfoTooltip 
              text={field.hint || ''}
            />
          </div>
          <div>
            { field.field_type == ActionFormFieldType.InputNumber &&
              <InputNumberComponent field={field} />
            }
            { field.field_type == ActionFormFieldType.InputString &&
              <InputStringComponent field={field} />
            }
            { field.field_type == ActionFormFieldType.SliderNumber &&
              <SliderNumberComponent field={field} />
            }
            { field.field_type == ActionFormFieldType.ProcessTimePicker &&
              <ProcessTimePickerComponent field={field} />
            }
            { field.field_type == ActionFormFieldType.DatePicker &&
              <ProcessTimePickerComponent field={field} />
            }
            { field.field_type == ActionFormFieldType.ProcessDurationPicker &&
              <ProcessDurationPickerComponent field={field} />
            }
          </div>
        </div>
      )}
    </div>
  )
})
