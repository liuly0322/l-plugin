import plugin from '../../../lib/plugins/plugin.js'
import cfg from '../../../lib/config/config.js'

const masterQQ = cfg.masterQQ[0]

const content =
  '原神Yunzai-bot plus\n' +
  '「塔罗牌」占卜\n' +
  '「每日/随机一题」LeetCode\n' +
  '「今日/昨日题解」查看答案\n' +
  '「r/roll」骰子\n' +
  '「(咱)今天吃什么」美食推荐\n' +
  '「添加/删除食物」更改群菜单\n' +
  '「tex」生成公式对应图片\n' +
  '「markdown」同上\n' +
  '「python」执行 python 代码\n' +
  '「求签」来鸣神大社抽签\n' +
  '「云崽/喵喵帮助」原神bot功能\n' + (masterQQ ? `联系：${masterQQ}` : '')

export class myHelp extends plugin {
  constructor () {
    super({
      name: '我的帮助',
      dsc: '发送帮助信息',
      event: 'message',
      priority: 10,
      rule: [
        {
          reg: '^#?help$',
          fnc: 'help'
        }
      ]
    })
  }

  async help () {
    await this.reply(content, false)
  }
}
