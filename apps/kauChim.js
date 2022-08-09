import lodash from 'lodash'
import moment from 'moment'
import plugin from '../../../lib/plugins/plugin.js'
import cards from '../data/kau_chim.js'

export class kauChim extends plugin {
  constructor () {
    super({
      name: 'kauChim',
      dsc: '求签',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^#?(抽签|求签|御神签)(\\s|$)',
          fnc: 'kauChim'
        }
      ]
    })
    this.prefix = 'L:other:kauChim:'
  }

  get key () {
    /** 群，私聊分开 */
    if (this.e.isGroup) {
      return `${this.prefix}${this.e.group_id}:${this.e.user_id}`
    } else {
      return `${this.prefix}private:${this.e.user_id}`
    }
  }

  get time () {
    return moment().format('X')
  }

  async checkUser () {
    const expireTime = await redis.get(this.key)
    if (expireTime && this.time <= expireTime) {
      return false
    }
    const newExpireTime = moment().endOf('day').format('X')
    await redis.setEx(this.key, 3600 * 24, newExpireTime)
    return true
  }

  async kauChim () {
    const card = lodash.sample(cards)
    const valid = await this.checkUser()
    if (!valid) {
      this.reply('（今天已经抽过了，明天再来看看吧…）')
      return
    }
    let msg = `${card?.name}\n${card?.dsc}`
    if (this.e.isGroup) {
      msg = '\n' + msg
    }
    await this.reply(msg, false, { at: true })
    if (card?.item) {
      this.reply(card?.item)
    }
  }
}
