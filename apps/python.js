import plugin from '../../../lib/plugins/plugin.js'
import lodash from 'lodash'
import fs from 'node:fs'
import crypto from 'node:crypto'
import util from 'node:util'
import childProcess from 'node:child_process'

const execPromise = util.promisify(childProcess.exec)
const fsPromises = fs.promises

export class python extends plugin {
  constructor () {
    super({
      name: 'python 代码运行',
      dsc: '启动 docker 运行 python 代码',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^python\\s',
          fnc: 'eval'
        }
      ]
    })
    this.path = './data/python'
  }

  async init () {
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path)
    }
  }

  async eval () {
    const code = this.e.msg.slice(7)
    const fileName = this.path + '/' + crypto.randomUUID()
    await fsPromises.writeFile(fileName, code)
    try {
      const { stdout } = await execPromise(`sudo docker run -i --rm ubuntu-python-playground-img < ${fileName}`)
      if (stdout) {
        let result = lodash.truncate(stdout, { length: 100 })
        await this.reply(result)
      } else {
        await this.reply('无标准输出内容！')
      }
    } catch (error) {
      await this.reply('执行失败...')
    }
  }
}
