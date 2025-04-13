import { ipcMain } from "electron"


export function defineIpcHandle(target: object, key: string, descriptor: PropertyDescriptor) {
  if (!ipcMain) return;
  ipcMain.handle(key, async (_, ...args) => {
    return await descriptor.value.apply(target, args)
  })
}


export function IpcChannel() {
  return defineIpcHandle
}
