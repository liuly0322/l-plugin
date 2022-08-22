/* eslint-disable no-undef */

import './init.js'
import '../../../lib/config/init.js'
import PluginsLoader from '../../../lib/plugins/loader.js'
import cfg from '../../../lib/config/config.js'
import assert from 'assert'
import log4js from 'log4js'

class Command {
  constructor () {
    this.command = ''
    this.retBuf = []
    global.Bot = {}
  }

  async init () {
    await PluginsLoader.load()
    PluginsLoader.checkLimit = () => true
  }

  async run (command) {
    this.command = command
    this.retBuf = []
    let e = this.fakeE()
    await PluginsLoader.deal(e)
    return this.retBuf
  }

  fakeE (id = 'default') {
    let data = cfg.getYaml('test', id)
    let text = this.command || data.text || ''
    logger.info(`测试命令 [${text}]`)
    const that = this
    let e = {
      test: true,
      self_id: 10000,
      time: new Date().getTime(),
      post_type: data.post_type || 'message',
      message_type: data.message_type || 'group',
      sub_type: data.sub_type || 'normal',
      group_id: data.group_id || 826198224,
      group_name: data.group_name || '测试群',
      user_id: data.user_id,
      anonymous: null,
      message: [{ type: 'text', text }],
      raw_message: text,
      font: '微软雅黑',
      sender: {
        user_id: data.user_id,
        nickname: '测试',
        card: data.card,
        sex: 'male',
        age: 0,
        area: 'unknown',
        level: 2,
        role: 'owner',
        title: ''
      },
      group: {
        mute_left: 0,
        sendMsg: (msg) => {
          logger.info(`回复内容 ${msg}`)
        }
      },
      friend: {
        getFileUrl: (fid) => {
          return data.message[0].url
        }
      },
      message_id: 'JzHU0DACliIAAAD3RzTh1WBOIC48',
      reply: async (msg) => {
        that.retBuf.push(msg)
        logger.info(`回复内容 ${msg}`)
      },
      toString: () => {
        return text
      }
    }

    if (data.message) {
      e.message = data.message
    }

    return e
  }
}

const command = new Command()
await command.init()

log4js.shutdown()

describe('塔罗牌', function () {
  it('应该返回一条牌面信息和对应图片', async function () {
    const res = await command.run('塔罗牌')
    assert.equal(res.length, 2)
    assert.equal(res[1].type, 'image')
  })
})

describe('每日一题', function () {
  it('应该返回一张图片和对应 url', async function () {
    const res = await command.run('每日一题')
    assert.equal(res.length, 2)
    assert.equal(res[0].type, 'image')
  })
})

describe('求签', function () {
  it('应该返回一条或两条签文消息', async function () {
    const res = await command.run('求签')
    assert(res.length == 1 || res.length == 2)
  })
})

describe('骰子', function () {
  describe('#r', function () {
    it('应该返回 114514 和 1919810 之间的一个随机数', async function () {
      const res = await command.run('r 114514 1919810')
      const num = Number(res.pop().split('：').pop())
      assert(Number.isInteger(num) && num >= 114514 && num <= 1919810)
    })
  })
  describe('#roll', function () {
    it('应该返回 a 或 b', async function () {
      const res = await command.run('roll a b')
      const choice = res.pop().pop().split('：').pop()
      assert(choice === 'a' || choice == 'b')
    })
  })
})

describe('吃什么', function () {
  describe('#今天吃什么', function () {
    it('应该返回随机五个食物', async function () {
      const res = await command.run('今天吃什么')
      const foods = res.pop().pop().split('：').pop()
      const times = foods.split('|').length
      assert.equal(times, 5)
    })
  })
  describe('#咱今天吃什么', function () {
    it('应该返回加入的特色菜', async function () {
      await command.run('#添加食物 雪')
      const res = await command.run('咱今天吃什么')
      const food = res.pop().pop().split('：').pop()
      assert.equal(food, '雪')
    })
  })
})

describe('Markdown', function () {
  it('应该返回一张 Markdown 图片', async function () {
    const res = await command.run('markdown ## Hello World!')
    assert.equal(res.length, 1)
    assert.equal(res[0].type, 'image')
  })
})

describe('Tex', function () {
  it('应该返回一张 Tex 图片', async function () {
    const res = await command.run('tex 9>10')
    assert.equal(res.length, 1)
    assert.equal(res[0].type, 'image')
  })
})
