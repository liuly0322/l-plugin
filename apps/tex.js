import plugin from '../../../lib/plugins/plugin.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import katex from 'katex'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class tex extends plugin {
  constructor () {
    super({
      name: 'tex 公式转换',
      dsc: '利用 katex 渲染 tex 公式',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^tex\\s$',
          fnc: 'render'
        }
      ]
    })
  }

  async render () {
    const formula = this.e.msg.slice(4)
    const texHtml = katex.renderToString(formula, { throwOnError: false })
    let data = {
      texHtml,
      tplFile: `${__dirname}/dailyLeetCode.html`
    }
    let img = await puppeteer.screenshot('dailyLeetCode', data)
    await this.reply(img)
  }
}
