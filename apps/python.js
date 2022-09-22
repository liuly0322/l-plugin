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
    const code = this.e.msg.split(/(?<=^\S+)\s/).pop()
    const fileName = this.path + '/' + crypto.randomUUID()
    await fsPromises.writeFile(fileName, code)
    try {
      // 这里的 stdout 是管理程序的输出，已经兼顾考虑了 stderr 和没有输出的情况
      let { stdout } = await execPromise(`sudo docker run -i --pids-limit 256 --rm ubuntu-python-playground-img < ${fileName}`)
      stdout = lodash.trim(stdout)
      if (stdout) {
        stdout = lodash.truncate(stdout, { length: 100 })
        await this.reply(stdout)
      } else {
        await this.reply('输出只包含空白字符...')
      }
    } catch (error) {
      await this.reply('docker出现错误...')
    }
  }
}
