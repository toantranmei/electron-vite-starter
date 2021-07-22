import type { App } from 'vue'
import { nextTick } from 'vue'

export const errorHandler = (App: App<Element>) => {
  App.config.errorHandler = (error, vm, info) => {
    nextTick(() => {
      if (process.env.NODE_ENV === 'development') {
        console.group('%c ======= Error Message =======', 'color:red')
        console.log(`%c ${info}`, 'color:blue')
        console.groupEnd()
        console.group(
          '%c ======= Vue instance object has an error occurred =======',
          'color:green'
        )
        console.log(vm)
        console.groupEnd()
        console.group('%c ======= The reason =======', 'color:red')
        console.error(error)
        console.groupEnd()
      }
    })
  }
}
