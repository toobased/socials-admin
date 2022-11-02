import { SocialSource } from "@/models/social_source"
import { AppContext } from "@/store/appStore"
import { SourceStoreContext } from "@/store/socialSourcesStore"
import { Button } from "@chakra-ui/react"
import { Icon } from "@iconify/react"
import { observer } from "mobx-react"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
// import Image from "next/image"
//
const AddSource = (params: { onAdd: Function }) => {
    return (
        <div>
            <Button onClick={() => params.onAdd()}>
                Добавить
            </Button>
        </div>
    )
}

const ReloadTasksButton = () => {
  const sourceStore = useContext(SourceStoreContext)
  Comment
  return (
    <Button
      onClick={async () => 
        await sourceStore.getSources()
      }
    >
      <Icon icon="iconoir:refresh-double" />
    </Button>
  )
}

const SourceCard = observer((params: { source: SocialSource, onRemove(s: SocialSource): Promise<void> }) => {
    const router = useRouter()
    const defaultAvatar = 'https://img.icons8.com/ios-filled/344/ionic.png'
    const { source, onRemove } = params
    const goSourcePage = () => {
        router.push(`/social_sources/${source.id}`)
    }
    const avatar = () => {
        return source.avatar === ''
            ? defaultAvatar
            : source.avatar
    }

    return (
        <div className="rounded-lg px-3 py-2 flex w-80 h-36  flex-col items-center gap-2 overflow-hidden justify-center cursor-pointer" onClick={() => goSourcePage()}>
            <img src={avatar()} alt="no avatar" className="w-16 object-contain" />
            <div className="text-lg font-medium text-center">
                {source.name}
            </div>
            <Button onClick={(e) => {
                e.stopPropagation()
                onRemove(source)
            }} colorScheme="red">
                <div className="flex gap-2 items-center py-1">
                    <Icon icon="fa6-solid:delete-left" />
                    <div className="font-normal">
                        удалить
                    </div>
                </div>
            </Button>
        </div>
    )
})

const SocialSourcesPage: NextPage = observer(() => {
    const appStore = useContext(AppContext)
    const sourceStore = useContext(SourceStoreContext)
    // const sourcesLoading = sourceStore.loaders.getSources
    // const tasksLoadingError = tasksStore.errors.tasksLoadingError
    const search = sourceStore.sourcesSearch

    useEffect(() => {
        sourceStore.getSources()
    }, [])

    function onSourceAdd() { appStore.modals.setAddSource(true) }
    const removeSource = async (s: SocialSource) => {
        await sourceStore.deleteSource(s)
        await sourceStore.getSources()
    }


    if (!search || !search.items) { return (<div> nothing here </div>) }

    return (
        <>
            <main className="mx-11 my-7">
                <div className="flex gap-2">
                    {/* add button */}
                    <AddSource onAdd={onSourceAdd} />
                    {/* eof add button */}
                    {/* reload button */}
                    <ReloadTasksButton />
                    {/* eof reload button */}
                </div>

                {/* sources */}
                <div className="flex flex-wrap gap-3 mt-5">
                    {search.items.map((s, indx) =>
                        <SourceCard
                            key={indx}
                            source={s}
                            onRemove={async (s: SocialSource) => await removeSource(s)}
                        />
                    )}
                </div>
                {/* eof sources */}

            </main>
        </>
    )
})

export default SocialSourcesPage
