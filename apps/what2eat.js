import plugin from '../../../lib/plugins/plugin.js'
import basicFood from '../data/foods.js'

export class what2eat extends plugin {
  constructor () {
    super({
      name: 'what2eat',
      dsc: '今天吃什么',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^咱?(今天|明天|[早中午晚][上饭餐午]|早上|夜宵|今晚)吃(什么|啥|点啥)',
          fnc: 'what2eat'
        },
        {
          reg: '^添加食物',
          fnc: 'addFood'
        },
        {
          reg: '^删除食物',
          fnc: 'deleteFood'
        }
      ]
    })
  }

  getKey () {
    return `Yz:what2eat:foods:${this.e.group_id}`
  }

  async addFood () {
    if (!this.e.isGroup) {
      return await this.reply('请群聊发送')
    }
    const key = this.getKey()
    const foods = this.e.msg.split(' ').slice(1)
    foods.forEach(async (food) => {
      await redis.sAdd(key, food)
    })
    await this.reply('添加成功！')
  }

  async deleteFood () {
    if (!this.e.isGroup) {
      return await this.reply('请群聊发送')
    }
    const key = this.getKey()
    const foods = this.e.msg.split(' ').slice(1)
    foods.forEach(async (food) => {
      await redis.sRem(key, food)
    })
    await this.reply('删除成功！')
  }

  async what2eat () {
    let food = basicFood
    if (this.e.isGroup) {
      const key = this.getKey()
      const groupFood = await redis.sMembers(key)
      food = this.e.msg.split(' ')[0]?.includes('咱')
        ? groupFood
        : [...basicFood, ...groupFood]
    }

    if (!food || food.length == 0) return

    const results = new Array(5)
      .fill('')
      .map(() => food[Math.floor(Math.random() * food.length)])
    const result = results.join('|')
    await this.reply(`推荐尝试：${result}`, false, { at: true })
  }
}
