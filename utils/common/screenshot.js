/**
 * This file rewrite puppeteer.screenshot
 * wait until no network connection detected
 */

import lodash from 'lodash'

export default async function (puppeteer, name, data) {
  if (!await puppeteer.browserInit()) {
    return false
  }

  let savePath = puppeteer.dealTpl(name, data)
  if (!savePath) return false

  let buff = ''
  let start = Date.now()
  try {
    puppeteer.shoting.push(name)

    const page = await puppeteer.browser.newPage()

    await page.goto(`file://${process.cwd()}${lodash.trim(savePath, '.')}`, { waitUntil: 'networkidle0' })
    let body = await page.$('#container')
    buff = await body.screenshot()

    page.close().catch((err) => logger.error(err))

    puppeteer.shoting.pop()
  } catch (error) {
    logger.error(`图片生成失败:${name}:${error}`)
    if (puppeteer.browser) {
      await puppeteer.browser.close().catch((err) => logger.error(err))
    }
    puppeteer.browser = false
    buff = ''
    return false
  }

  if (!buff) {
    logger.error(`图片生成为空:${name}`)
    return false
  }

  puppeteer.renderNum++
  let kb = (buff.length / 1024).toFixed(2) + 'kb'
  logger.mark(`[图片生成][${name}][${puppeteer.renderNum}次] ${kb} ${logger.green(`${Date.now() - start}ms`)}`)

  puppeteer.restart()

  return segment.image(buff)
}
