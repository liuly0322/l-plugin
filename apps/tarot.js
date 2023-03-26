import fs from 'fs'
import downloadFile from '../utils/common/download.js'
import lodash from 'lodash'
import plugin from '../../../lib/plugins/plugin.js'
import cards from '../data/tarot.js'

const _path = process.cwd()
const tarotsPath = `${_path}/plugins/l-plugin/data/tarots/`

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

    const localPath = tarotsPath + card.type + '/' + card.pic
    try {
      if (fs.existsSync(localPath)) {
        const pic = segment.image(localPath)
        return await this.reply(pic)
      }
    } catch (e) {}

    // 尝试下载到本地
    const url = 'https://fastly.jsdelivr.net/gh/MinatoAquaCrews/nonebot_plugin_tarot@beta/nonebot_plugin_tarot/resource/' + card.type + '/' + card.pic
    const ret = await downloadFile(url, localPath)
    if (ret === 'error') {
      return await this.reply('下载图片失败，如果多次出现本提示可以考虑手动下载...')
    }
    const pic = segment.image(localPath)
    await this.reply(pic)
  }
}
