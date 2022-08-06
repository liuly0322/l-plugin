import plugin from '../../../lib/plugins/plugin.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import axios from 'axios'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const BASE_URL = 'https://leetcode-cn.com'

export class dailyLeetCode extends plugin {
  constructor () {
    super({
      name: 'leetcode每日一题',
      dsc: '生成并发送leetcode每日一题图片',
      event: 'message',
      priority: 300,
      rule: [
        {
          reg: '^每日一题$',
          fnc: 'dailyLeetCode'
        }
      ]
    })
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
}
