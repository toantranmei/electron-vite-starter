/**
 * Performance Stats - Calculation method execution time
 * @returns {void}
 * @date 2021-108-23
 */

import Scheduler from './scheduler'

class Stats {
  startExecute(name = '') {
    const timer = Scheduler.start()
    const usedJSHeapSize = this.getMemoryInfo().usedJSHeapSize
    return (subName = '') => {
      const executeTime = timer.stop()
      const endMemoryInfo = this.getMemoryInfo()
      console.log(
        '%cPerformance%c \n1. Execution Stats Method：%c%s%c\n2. Time-consuming execution： %c%sms%c \n3. Memory fluctuation：%sB \n4. Allocated memory： %sMB \n5. Used memory：%sMB \n6. Remaining memory： %sMB',
        'padding: 2px 4px 2px 4px; background-color: #4caf50; color: #fff; border-radius: 4px;',
        '',
        'color: #ff6f00',
        `${name} ${subName}`,
        '',
        'color: #ff6f00',
        executeTime,
        '',
        endMemoryInfo.usedJSHeapSize - usedJSHeapSize,
        this.toMBSize(endMemoryInfo.jsHeapSizeLimit),
        this.toMBSize(endMemoryInfo.usedJSHeapSize),
        this.toMBSize(endMemoryInfo.totalJSHeapSize)
      )
    }
  }

  getMemoryInfo() {
    let memoryInfo = <memoryInfo>{}
    if (window.performance && window.performance.memory) {
      memoryInfo = window.performance.memory
    }
    return memoryInfo
  }

  toMBSize(byteSize: number) {
    return (byteSize / (1024 * 1024)).toFixed(1)
  }
}

export default new Stats()
