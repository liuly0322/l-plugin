import plugin from '../../../lib/plugins/plugin.js'
import lodash from 'lodash'

export class dice extends plugin {
  constructor () {
    super({
      name: 'roll',
      dsc: 'roll骰子',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^#?roll ',
          fnc: 'roll'
        },
        {
          reg: '^#?r ',
          fnc: 'r'
        }
      ]
    })
  }

  async roll () {
    const choices = this.e.msg.split(' ').slice(1)
    const result = lodash.sample(choices)
    await this.reply(`bot帮你选择：${result}`, false, { at: true })
  }

  async r () {
    const range = this.e.msg.split(' ').slice(1)
    const end = parseInt(range.pop() ?? 100) || 0
    const start = parseInt(range.pop() ?? 1) || 0
    const result = lodash.random(start, end);
    await this.reply(`在${start}和${end}间roll到了：${result}`)
  }
}
