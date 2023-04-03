import fs from 'fs'
import downloadFile from '../utils/common/download.js'
import lodash from 'lodash'
import moment from 'moment'
import plugin from '../../../lib/plugins/plugin.js'
import cards from '../data/tarot.js'
import YAML from 'yaml'

const _path = process.cwd()
const tarotsPath = `${_path}/plugins/l-plugin/data/tarots/`

let limit

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
    this.file = './plugins/l-plugin/data/tarotConfig.yaml'
    this.prefix = 'L:other:tarot:'
  }

  async init () {
    if (!fs.existsSync(this.file)) {
      fs.writeFileSync(this.file, `limit: 5`)
    }
    const limitConfigStr = fs.readFileSync(this.file, 'utf8')
    const limitConfig = YAML.parse(limitConfigStr).limit
    limit = Math.max(parseInt(limitConfig) || 1, 1)
  }

  get key () {
    /** 群，私聊分开 */
    if (this.e.isGroup) {
      return `${this.prefix}${this.e.group_id}:${this.e.user_id}`
    } else {
      return `${this.prefix}private:${this.e.user_id}`
    }
  }

  async canAccessTarot() {
    const counterValue = await redis.get(this.key)
    if (counterValue === null) {
      const endOfDay = moment().endOf('day')
      const remainingSeconds = endOfDay.diff(moment(), 'seconds')
      try {
        await redis.setEx(this.key, remainingSeconds, '1')
      } catch (err) {
        console.log(err)
      }
      return true
    }

    console.log(counterValue, typeof counterValue)

    if (parseInt(counterValue) >= limit) {
      return false;
    }

    await redis.incr(this.key)
    return true
  }

  async tarot () {
    const canAccess = await this.canAccessTarot()
    if (!canAccess) {
      return await this.reply('已达到今日占卜上限了哦~')
    }

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
    const url = 'https://fastly.jsdelivr.net/gh/MinatoAquaCrews/nonebot_plugin_tarot/nonebot_plugin_tarot/resource/BilibiliTarot/' + card.type + '/' + card.pic
    const ret = await downloadFile(url, localPath)
    if (ret === 'error') {
      return await this.reply('下载图片失败，如果多次出现本提示可以考虑手动下载...')
    }
    const pic = segment.image(localPath)
    await this.reply(pic)
  }
}
