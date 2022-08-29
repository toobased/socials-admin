import { ActionFormConfig, ActionFormField, ActionFormFieldType } from "@/models/action_form"
import { Input, NumberInput, NumberInputField } from "@chakra-ui/react"
import { observer } from "mobx-react"
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

export const TaskActionForm = observer((props: TaskActionFormProps) => {
  const config = props.config
  const fields = config.fields
  return (
    <div className="bg-white p-4 rounded-lg">
      <div>
        content is there
        {JSON.stringify(fields)}
      </div>
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
          </div>
        </div>
      )}
    </div>
  )
})
