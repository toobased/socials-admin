import CopyClipboardButton from "@/components/buttons/CopyClipboardButton"
import ExtLinkButton from "@/components/buttons/ExtLinkButton"
import { AddSourcePlatformModal } from "@/components/social_source/AddSourcePlatformModal"
import { platformFilters } from "@/models/bots"
import { SocialSource, SourcePlatformInfo } from "@/models/social_source"
import { AppContext } from "@/store/appStore"
import { SourceStoreContext } from "@/store/socialSourcesStore"
import { Button, Input } from "@chakra-ui/react"
import { Icon } from "@iconify/react"
import { observer } from "mobx-react"
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"

const SourcePlatforms = observer(() => {
  const sourceStore = useContext(SourceStoreContext)
  const currentSource = sourceStore.currentSource

  const plat = (p: SourcePlatformInfo) => {
    return platformFilters.find(v => v.label == p.platform) || platformFilters[0]
  }

  const remove = async (v: SourcePlatformInfo) => {
    currentSource.platforms = currentSource.platforms
      .filter(p => p.platform != v.platform)
    await sourceStore.updateGetCurrent()
  }

  return (
    <div className="flex gap-4 flex-wrap">
      {currentSource.platforms.map((v, i) => {
        const p = plat(v)

        return (
          <div key={i}
            className="bg-white min-w-[300px] p-4 rounded-lg min-h-[100px] relative"
          >
            <div className="flex gap-2 items-center mt-2 mb-3">
              <div>
                <Icon icon={p.icon || ''} color={p.iconColor || ''} fontSize="25px" />
              </div>
              <div className="font-medium text-lg">
                {p.label}
              </div>
            </div>
            <div className="flex gap-1 items-center">
              <Input
                disabled={!v.isEdit}
                value={v.source_link}
                onChange={e => v.source_link = e.target.value}
              />
              <div className="flex">
                <Button onClick={() => v.setEdit(!v.isEdit)} size="xs">
                  <Icon icon={!v.isEdit ? "eva:edit-fill": "bi:check-lg"} width={18} />
                </Button>
                <CopyClipboardButton copyContent={v.source_link} />
                <ExtLinkButton link={v.source_link} />
              </div>
            </div>
            <div className="absolute -top-3 inset-x-1/2">
              <Button onClick={() => remove(v)} size="xs" bgColor="red.400">
                <Icon icon="fa6-solid:delete-left" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
})

const AddPlatformButton = observer(() => {
  const appStore = useContext(AppContext)
  const modals = appStore.modals

  return (
    <div className="">
        <Button onClick={() => modals.setAddSourcePlatform(true) } >
          Добавить платформу
        </Button>
    </div>
  )
})

const SaveButton = ((props: {show: boolean, onSave: Function}) => {
  const {show, onSave} = props
  if (!show) { return <></> }
  return (
    <div onClick={() => onSave()} className="fixed top-20 right-10">
        <Button>
          Сохранить
        </Button>
    </div>
  )
})

const SourceHeader = observer(() => {
    const defaultAvatar = 'https://img.icons8.com/ios-filled/344/ionic.png'
    const sourceStore = useContext(SourceStoreContext)
    const source: SocialSource = sourceStore.currentSource

    if (!source) { return (<></>) }

    const avatar = () => {
        return source.avatar === ''
            ? defaultAvatar
            : source.avatar
    }

  return (
    <div className="flex gap-3 items-center">
        <div>
            <img src={avatar()} className="w-52 object-contain" />
        </div>
        <div>
          <Input
            fontSize="4xl"
            size="lg"
            value={source.name}
            onChange={e => source.setName(e.target.value)}
          />
          <div className="mt-3">
            <AddPlatformButton />
          </div>
        </div>
    </div>
  )
})

const SourcePage = observer(() => {
  const sourceStore = useContext(SourceStoreContext)
  const router = useRouter()
  const { id } = router.query

  const source = sourceStore.currentSource
  const tasks = sourceStore.currentTasks

  const showSave = () => { return true }
  const onSave = async () => {
   await sourceStore.updateSource(source)
   await sourceStore.getSource(source.id)
  }

  useEffect(() => {
    if (
      !(id) ||
      !(typeof id == 'string') ||
      (id === '')
    ) {
        console.log('tst no id, return')
        return
    }
    sourceStore.getSource(id).then(() => {
        sourceStore.getSourceTasks()
    })
  }, [id])

  if (!id) { return( <>No id</> )}
  if (sourceStore.loaders.getSource) { return( <>Loading...</>)}
  if (!source) { return( <>Nothing here</> )}

  return (
    <div className="max-w-screen-xl mx-auto relative py-8">
      <AddSourcePlatformModal />
      <SaveButton show={showSave()} onSave={async () => await onSave()} />
      <SourceHeader />
      <div className="mt-10">
        <SourcePlatforms />
      </div>
      { JSON.stringify(tasks) }
    </div>
  )
})

export default SourcePage
