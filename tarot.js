import { segment } from 'oicq'
import plugin from '../../lib/plugins/plugin.js'
import tarots from './tarot.json' assert { type: 'json' }

const cards = tarots['cards']

export class tarot extends plugin {
  constructor() {
    super({
      name: 'tarot',
      dsc: '塔罗牌',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^#?塔罗牌',
          fnc: 'tarot',
        },
      ],
    })
  }

  async tarot() {
    const card = cards[String(Math.floor(Math.random() * 77))]
    const name = card['name_cn']
    const is_up = Math.random() > 0.5
    await this.reply(
      `\n「${is_up ? '正位' : '逆位'}」${name}\n回应是：${
        is_up ? card['meaning']['up'] : card['meaning']['down']
      }`,
      false,
      { at: true }
    )
    const path =
      'https://fastly.jsdelivr.net/gh/MinatoAquaCrews/nonebot_plugin_tarot@beta/nonebot_plugin_tarot/resource/' +
      card['type'] +
      '/' +
      card['pic']
    const pic = segment.image(encodeURI(path))
    await this.reply(pic)
  }
}
