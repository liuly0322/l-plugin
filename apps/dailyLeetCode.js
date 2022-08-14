import plugin from '../../../lib/plugins/plugin.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import axios from 'axios'
import lodash from 'lodash'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const BASE_URL = 'https://leetcode.cn'
let cachedQuestionsAll = null

export class dailyLeetCode extends plugin {
  constructor () {
    super({
      name: 'leetcode每日一题',
      dsc: '生成并发送leetcode每日一题图片',
      event: 'message',
      priority: 300,
      rule: [
        {
          reg: '^#?每日一题$',
          fnc: 'dailyLeetCode'
        },
        {
          reg: '^#?随机一题(.*\\w)?$',
          fnc: 'randomLeetCode'
        }
      ]
    })
  }

  async renderData (title) {
    const question = await axios.post(BASE_URL + '/graphql', {
      operationName: 'questionData',
      variables: { titleSlug: title },
      query:
        'query questionData($titleSlug: String!) {  question(titleSlug: $titleSlug) {    questionId    questionFrontendId    boundTopicId    title    titleSlug    content    translatedTitle    translatedContent    isPaidOnly    difficulty    likes    dislikes    isLiked    similarQuestions    contributors {      username      profileUrl      avatarUrl      __typename    }    langToValidPlayground    topicTags {      name      slug      translatedName      __typename    }    companyTagStats    codeSnippets {      lang      langSlug      code      __typename    }    stats    hints    solution {      id      canSeeDetail      __typename    }    status    sampleTestCase    metaData    judgerAvailable    judgeType    mysqlSchemas    enableRunCode    envInfo    book {      id      bookName      pressName      source      shortDescription      fullDescription      bookImgUrl      pressImgUrl      productUrl      __typename    }    isSubscribed    isDailyQuestion    dailyRecordStatus    editorType    ugcQuestionId    style    __typename  }}'
    })
    const questionBody = question.data.data.question

    const no = questionBody.questionFrontendId
    const titleCn = questionBody.translatedTitle
    const level = questionBody.difficulty
    const context = questionBody.translatedContent
    const problemUrl = BASE_URL + '/problems/' + title

    let data = {
      no,
      titleCn,
      level,
      context,
      tplFile: `${__dirname}/dailyLeetCode.html`
    }

    let img = await puppeteer.screenshot('dailyLeetCode', data)
    await this.reply(img)

    await this.reply(problemUrl)
  }

  async dailyLeetCode () {
    const questionEn = await axios.post(BASE_URL + '/graphql', {
      operationName: 'questionOfToday',
      variables: {},
      query:
        'query questionOfToday { todayRecord {   question {     questionFrontendId     questionTitleSlug     __typename   }   lastSubmission {     id     __typename   }   date   userStatus   __typename }}'
    })
    const title =
      questionEn.data.data.todayRecord[0].question.questionTitleSlug
    await this.renderData(title)
  }

  async randomLeetCode () {
    const questionsAll = cachedQuestionsAll ?? await axios.get(BASE_URL + '/api/problems/all/')
    if (!questionsAll) {
      return await this.reply('Leetcode API网络错误...')
    }
    cachedQuestionsAll = questionsAll

    const msg = this.e.msg.toLowerCase()
    let questions = questionsAll.data.stat_status_pairs
      .filter((q) => q.paid_only === false)
    if (msg.includes('easy')) {
      questions = questions.filter((q) => q.difficulty.level == 1)
    }
    if (msg.includes('medium')) {
      questions = questions.filter((q) => q.difficulty.level == 2)
    }
    if (msg.includes('hard')) {
      questions = questions.filter((q) => q.difficulty.level == 3)
    }
    if (!questions) {
      return await this.reply('Leetcode API格式错误...')
    }

    const titles = questions.map((q) => q.stat.question__title_slug)
    const title = lodash.sample(titles)
    await this.renderData(title)
  }
}
