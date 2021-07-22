/**
 * Define static file path here
 * @description static path, maybe file render, update, dll, extra resources
 * @author trantoan960<trantoan.fox.97@gmail.com>
 * @date 2021/07/22
 */
import { join } from 'path'

export const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:${process.env.PORT}`
    : `file://${join(__dirname, '..', 'renderer', 'index.html')}`

export const loadingURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:${process.env.PORT}/preloader.html`
    : `file://${process.env.__static}/preloader.html`
