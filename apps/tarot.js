import { segment } from 'oicq'
import lodash from 'lodash'
import plugin from '../../../lib/plugins/plugin.js'
import cards from '../data/tarot.js'

export class tarot extends plugin {
  constructor () {
    super({
      name: 'tarot',
      dsc: '塔罗牌',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^#?塔罗牌',
          fnc: 'tarot'
        }
      ]
    })
  }

  async tarot () {
    const card = lodash.sample(cards)
    const name = card.name_cn
    const isUp = lodash.random(0, 1)
    await this.reply(
      `\n「${isUp ? '正位' : '逆位'}」${name}\n回应是：${
        isUp ? card.meaning.up : card.meaning.down
      }`,
      false,
      { at: true }
    )
    const path =
      'https://fastly.jsdelivr.net/gh/MinatoAquaCrews/nonebot_plugin_tarot@beta/nonebot_plugin_tarot/resource/' +
      card.type +
      '/' +
      card.pic
    const pic = segment.image(encodeURI(path))
    await this.reply(pic)
  }
}
