/**
 * Scheduler
 *
 * @author trantoan960<trantoan.fox.97@gmail.com>
 * @date 2021-08-23
 */

class Scheduler {
  scheduler(interval: number, args?: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(args)
      }, interval)
    })
  }

  inTheEnd() {
    return this.scheduler(0)
  }

  interval(interval: number, callback: Function) {
    this.scheduler(interval).then(() => {
      typeof callback === 'function' &&
        callback() !== false &&
        this.interval(interval, callback)
    })
    return { then: (chain: any) => (callback = chain) }
  }

  start() {
    const startDate = new Date()
    return {
      stop() {
        const stopDate = new Date()
        return stopDate.getTime() - startDate.getTime()
      },
    }
  }
}

// importantly, "new" here =)))
export default new Scheduler()
