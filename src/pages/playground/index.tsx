import api from "@/api/app"
import { successMessageChakra } from "@/utils"
import { Button } from "@chakra-ui/react"
import { NextPage } from "next"

const TestWindowTab = () => {


    async function someAsync () {
        try {
            await api.getCommonInfo()
        } catch {}
        // return Promise.resolve('something')
    }

    function openUrl () {
        window.open("https://google.com", "_blank")?.focus()
    }

    async function doAction () {
        // alert("is clicked. You will be redirected")
        successMessageChakra('do action')
        // openUrl()
        const w = window.open()
        await someAsync()
        w && (w.location.href = "https://google.com")
        w?.focus()
        await someAsync()
    }

    return (
        <Button onClick={async () => await doAction()}>
            click me
        </Button>
    )
}

const PlaygroundPage: NextPage = (() => {
    return (
        <main className="mx-11 my-7">
            <div>
                some stuff here
            </div>
            <TestWindowTab />
        </main>
    )
})

export default PlaygroundPage
