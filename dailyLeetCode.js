import plugin from '../../lib/plugins/plugin.js'
import puppeteer from '../../lib/puppeteer/puppeteer.js'
import axios from 'axios'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const base_url = 'https://leetcode-cn.com'

export class dailyLeetCode extends plugin {
  constructor() {
    super({
      name: 'leetcode每日一题',
      dsc: '生成并发送leetcode每日一题图片',
      event: 'message',
      priority: 300,
      rule: [
        {
          reg: '^每日一题$',
          fnc: 'dailyLeetCode',
        },
      ],
    })
  }

  async dailyLeetCode() {
    const question_en = await axios.post(base_url + '/graphql', {
      operationName: 'questionOfToday',
      variables: {},
      query:
        'query questionOfToday { todayRecord {   question {     questionFrontendId     questionTitleSlug     __typename   }   lastSubmission {     id     __typename   }   date   userStatus   __typename }}',
    })
    const title =
      question_en['data']['data']['todayRecord'][0]['question'][
        'questionTitleSlug'
      ]

    const question = await axios.post(base_url + '/graphql', {
      operationName: 'questionData',
      variables: { titleSlug: title },
      query:
        'query questionData($titleSlug: String!) {  question(titleSlug: $titleSlug) {    questionId    questionFrontendId    boundTopicId    title    titleSlug    content    translatedTitle    translatedContent    isPaidOnly    difficulty    likes    dislikes    isLiked    similarQuestions    contributors {      username      profileUrl      avatarUrl      __typename    }    langToValidPlayground    topicTags {      name      slug      translatedName      __typename    }    companyTagStats    codeSnippets {      lang      langSlug      code      __typename    }    stats    hints    solution {      id      canSeeDetail      __typename    }    status    sampleTestCase    metaData    judgerAvailable    judgeType    mysqlSchemas    enableRunCode    envInfo    book {      id      bookName      pressName      source      shortDescription      fullDescription      bookImgUrl      pressImgUrl      productUrl      __typename    }    isSubscribed    isDailyQuestion    dailyRecordStatus    editorType    ugcQuestionId    style    __typename  }}',
    })
    const question_body = question['data']['data']['question']

    const no = question_body['questionFrontendId']
    const title_cn = question_body['translatedTitle']
    const level = question_body['difficulty']
    const context = question_body['translatedContent']
    const problem_url = base_url + '/problems/' + title

    let data = {
      no: no,
      title_cn: title_cn,
      level: level,
      context: context,
      problem_url: problem_url,
      tplFile: `${__dirname}/dailyLeetCode.html`,
    }

    let img = await puppeteer.screenshot('dailyLeetCode', data)
    await this.reply(img)
  }
}
