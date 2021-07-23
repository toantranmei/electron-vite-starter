import router from '../router'
import Stats from '@renderer/utils/stats'

// Routing performance monitoring for every route
router.beforeEach((to, from, next) => {
  const end = Stats.startExecute(
    `${from.path} => ${to.path} time-consuming routing`
  )

  next()

  // importantly, we should be behind next() & run immediately
  setTimeout(() => {
    end()
  }, 0)
})

router.afterEach(() => {})
