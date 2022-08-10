import plugin from '../../../lib/plugins/plugin.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import MarkdownIt from 'markdown-it'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const md = new MarkdownIt({
  html: true
})

export class markdown extends plugin {
  constructor () {
    super({
      name: 'markdown 转换',
      dsc: '渲染 markdown 文本',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^#?markdown\\s',
          fnc: 'render'
        }
      ]
    })
  }

  async render () {
    const text = this.e.msg.split(/(?<=^\S+)\s/).pop()
    const markdownHtml = md.render(text)
    let data = {
      markdownHtml,
      tplFile: `${__dirname}/markdown.html`
    }
    let img = await puppeteer.screenshot('markdown', data)
    await this.reply(img)
  }
}
