import { platformFilters } from "@/models/bots"
import { PlatformEnum } from "@/models/enums/bots"
import { AppContext } from "@/store/appStore"
import { SourceStoreContext } from "@/store/socialSourcesStore"
import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { Icon } from "@iconify/react"
import { observer } from "mobx-react"
import { useContext, useState } from "react"

const CommonInfo = observer(() => {
  const sourceStore = useContext(SourceStoreContext)
  const newPlatform = sourceStore.newSourcePlatform
    return (
        <div>
            <div>
                <div className="font-semibold text-md mb-1">
                    Ссылка на ресурс
                </div>
                <Input
                    placeholder="Ссылка на ресурс"
                    value={newPlatform.source_link}
                    onChange={e => newPlatform.source_link = e.target.value}
                />
            </div>
        </div>
    )
})

const ChoosePlatform = observer((params: {
    onSelect: Function
}) => {
  const sourceStore = useContext(SourceStoreContext)
  const newPlatform = sourceStore.newSourcePlatform

  const exclude = ['All']
  const platforms = platformFilters.filter(p => !exclude.includes(p.label))

  return (
    <div>
        <div className="grid grid-cols-3 gap-3">
        {platforms.map((p,i) =>
            <div
                onClick={() => {
                    newPlatform.platform = p.label as PlatformEnum
                    params.onSelect()
                }}
                key={i} className="flex gap-2 p-3 text-lg items-center bg-gray-100 rounded-xl cursor-pointer">
                <div>
                    <Icon icon={p.icon || ''} color={p.iconColor} />
                </div>
                <div>
                    { p.label }
                </div>
            </div>
        )}
        </div>
    </div>
  )
})

enum AddSourcePlatformState {
    ChoosePlatform,
    CommonInfo
}

export const AddSourcePlatformModal = observer(() => {
  const appStore = useContext(AppContext)
  const sourceStore = useContext(SourceStoreContext)
  const modals = appStore.modals
  const newPlatform = sourceStore.newSourcePlatform

  const [pState, setPState] = useState(AddSourcePlatformState.ChoosePlatform)

  function goPlatformSelect () {
    setPState(AddSourcePlatformState.ChoosePlatform)
  }

  function goCommonInfo () {
    setPState(AddSourcePlatformState.CommonInfo)
  }

  async function addPlatform () {
  }

  const showAddPlatform = () => {
    return pState == AddSourcePlatformState.CommonInfo
  }

  const onClose = () => {
    newPlatform.clear()
    goPlatformSelect()
    modals.setAddSourcePlatform(false)
  }
  const onAdd = async () => {
    sourceStore.currentSource.platforms.push(newPlatform)
    await sourceStore.updateSource(sourceStore.currentSource)
    await sourceStore.getSource(sourceStore.currentSource.id)
    onClose()
  }

  return (
      <Modal size="xl" isOpen={modals.add_source_platform} onClose={() => onClose()}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Добавление платформы</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              {pState == AddSourcePlatformState.ChoosePlatform &&
                <ChoosePlatform onSelect={() => goCommonInfo() }/>
              }
              {pState == AddSourcePlatformState.CommonInfo &&
                <CommonInfo />
              }
          </ModalBody>
                

          {showAddPlatform() &&
          <div className="p-6 w-full flex justify-center">
            <Button
                width={"100%"}
                className="max-w-md"
                onClick={async () => await onAdd()}>
                Добавить
            </Button>
          </div>
          }

        </ModalContent>
      </Modal>
  )
})
