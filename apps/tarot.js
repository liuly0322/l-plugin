import fs from 'fs'
import fetch from 'node-fetch'
import { segment } from 'oicq'
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
    const url = 'https://raw.fastgit.org/MinatoAquaCrews/nonebot_plugin_tarot/beta/nonebot_plugin_tarot/resource/' + card.type + '/' + card.pic
    const res = await fetch(url)
    if (res.status !== 200) {
      return await this.reply('下载图片失败，如果出现多次本提示可以考虑手动下载...')
    }
    const fileStream = fs.createWriteStream(localPath)
    await new Promise((resolve, reject) => {
      res.body.pipe(fileStream)
      res.body.on('error', reject)
      fileStream.on('finish', resolve)
    })
    const pic = segment.image(localPath)
    await this.reply(pic)
  }
}
