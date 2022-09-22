import axios from 'axios'
import util from 'util'
import stream from 'stream'
import fs from 'fs'

const pipeline = util.promisify(stream.pipeline)

export default async (url, savedPath) => {
  try {
    const request = await axios.get(encodeURI(url), {
      responseType: 'stream'
    })
    await pipeline(request.data, fs.createWriteStream(savedPath))
  } catch (error) {
    console.log(error)
    return 'error'
  }
}
