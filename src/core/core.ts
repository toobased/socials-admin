import { successMessageChakra } from "@/utils";

class Notify {
  update (msg: string = 'Updated!') {
    successMessageChakra(msg)
  }
}

export class AppCore {
  notify = new Notify();
}

export const appCore = new AppCore()
