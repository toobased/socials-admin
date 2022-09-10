import { AppContext } from "@/store/appStore"
import { SourceStoreContext } from "@/store/socialSourcesStore"
import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { observer } from "mobx-react"
import { useContext } from "react"

export const AddSourceModal = observer(() => {
  const appStore = useContext(AppContext)
  const sourceStore = useContext(SourceStoreContext)
  const modals = appStore.modals
  const newSource = sourceStore.newSource

  const onClose = () => {
    newSource.clear()
    modals.setAddSource(false)
  }
  const onAdd = async () => {
    // @todo
    await sourceStore.createSource(newSource)
    await sourceStore.getSources()
    onClose()
  }

  return (
      <Modal size="xl" isOpen={modals.add_source} onClose={() => onClose()}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Добавление таргета</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="font-semibold text-md mb-1">
              Название таргета
            </div>
            <Input
              placeholder="Введи название таргета"
              value={newSource.name}
              onChange={(e) => {
                newSource.name = e.target.value
              }}
            />
          </ModalBody>

          <div className="p-6 w-full flex justify-center">
            <Button
                width={"100%"}
                className="max-w-md"
                onClick={async () => await onAdd()}>
                Добавить
            </Button>
          </div>
        </ModalContent>
      </Modal>
  )
})
