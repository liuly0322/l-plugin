import plugin from '../../../lib/plugins/plugin.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import axios from 'axios'
import lodash from 'lodash'
import moment from 'moment'
import MarkdownIt from 'markdown-it'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const md = new MarkdownIt({
  html: true
})

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
        },
        {
          reg: '^#?(昨日|今日)?题解$',
          fnc: 'solve'
        }
      ]
    })
    this.prefix = 'L:other:leetcode:'
  }

  get time () {
    return moment().format('X')
  }

  get lastTimeKey () {
    return this.prefix + 'last'
  }

  get leetcodeHistoryKey () {
    return this.prefix + 'history'
  }

  async renderQuestion (title) {
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

  async todayTitle () {
    const questionEn = await axios.post(BASE_URL + '/graphql', {
      operationName: 'questionOfToday',
      variables: {},
      query:
        'query questionOfToday { todayRecord {   question {     questionFrontendId     questionTitleSlug     __typename   }   lastSubmission {     id     __typename   }   date   userStatus   __typename }}'
    })
    const title =
      questionEn.data.data.todayRecord[0].question.questionTitleSlug
    return title
  }

  async dailyLeetCode () {
    const history = await this.updateHistory()
    if (!history.today) {
      return await this.reply('获取今日题目失败...')
    }
    await this.renderQuestion(history.today)
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
    await this.renderQuestion(title)
  }

  /**
   * 检查是否需要更新历史题目
   * @returns {Promise<boolean>} 仅当每天第一次访问的时候返回 true
   */
  async checkHistoryUpdate () {
    const expireTime = await redis.get(this.lastTimeKey)
    if (expireTime && this.time <= expireTime) {
      return false
    }
    const newExpireTime = moment().endOf('day').format('X')
    await redis.setEx(this.lastTimeKey, 3600 * 24, newExpireTime)
    return true
  }

  /**
   * 更新历史记录
   * @typedef {Object} History
   * @property {string} today - Today's slug
   * @property {string} last - Yesterday's slug
   * @returns {Promise<History>} 昨日和今日的题目信息
   */
  async updateHistory () {
    const needUpdate = await this.checkHistoryUpdate()
    if (needUpdate) {
      const historyTitles = await redis.get(this.leetcodeHistoryKey)
      const last = historyTitles?.split(',').pop().concat(',') || ''
      try {
        const today = await this.todayTitle()
        await redis.setEx(this.leetcodeHistoryKey, 3600 * 24 * 14, last + today)
        return { today, last }
      } catch (error) {
        // 获取今日标题失败，下一次仍然需要更新历史
        await redis.setEx(this.lastTimeKey, 3600 * 24, this.time)
        return { today: '', last }
      }
    }
    const historyValue = await redis.get(this.leetcodeHistoryKey)
    const historyTitles = historyValue?.split(',') || []
    const today = historyTitles.pop() || ''
    const last = historyTitles.pop() || ''
    return { today, last }
  }

  async solve () {
    const history = await this.updateHistory()
    let slug = history.today
    if (this.e.msg.includes('昨日')) {
      slug = history.last
    }
    if (!slug) {
      return await this.reply('暂时没有获取到题目信息...')
    }
    const comments = await axios.post(BASE_URL + '/graphql', {
      operationName: 'questionSolutionArticles',
      variables: {
        questionSlug: slug,
        first: 10,
        skip: 0,
        orderBy: 'DEFAULT'
      },
      query: 'query questionSolutionArticles($questionSlug: String!, $skip: Int, $first: Int, $orderBy: SolutionArticleOrderBy, $userInput: String, $tagSlugs: [String!]) {\n  questionSolutionArticles(questionSlug: $questionSlug, skip: $skip, first: $first, orderBy: $orderBy, userInput: $userInput, tagSlugs: $tagSlugs) {\n    totalNum\n    edges {\n      node {\n        ...solutionArticle\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment solutionArticle on SolutionArticleNode {\n  ipRegion\n  rewardEnabled\n  canEditReward\n  uuid\n  title\n  slug\n  sunk\n  chargeType\n  status\n  identifier\n  canEdit\n  canSee\n  reactionType\n  reactionsV2 {\n    count\n    reactionType\n    __typename\n  }\n  tags {\n    name\n    nameTranslated\n    slug\n    tagType\n    __typename\n  }\n  createdAt\n  thumbnail\n  author {\n    username\n    profile {\n      userAvatar\n      userSlug\n      realName\n      __typename\n    }\n    __typename\n  }\n  summary\n  topic {\n    id\n    commentCount\n    viewCount\n    __typename\n  }\n  byLeetcode\n  isMyFavorite\n  isMostPopular\n  isEditorsPick\n  hitCount\n  videosInfo {\n    videoId\n    coverUrl\n    duration\n    __typename\n  }\n  __typename\n}\n'
    })
    const firstComment = comments.data.data.questionSolutionArticles.edges[0].node.slug
    const commentData = await axios.post(BASE_URL + '/graphql', {
      operationName: 'solutionDetailArticle',
      variables: {
        slug: firstComment,
        orderBy: 'DEFAULT'
      },
      query: 'query solutionDetailArticle($slug: String!, $orderBy: SolutionArticleOrderBy!) {\n  solutionArticle(slug: $slug, orderBy: $orderBy) {\n    ...solutionArticle\n    content\n    question {\n      questionTitleSlug\n      __typename\n    }\n    position\n    next {\n      slug\n      title\n      __typename\n    }\n    prev {\n      slug\n      title\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment solutionArticle on SolutionArticleNode {\n  ipRegion\n  rewardEnabled\n  canEditReward\n  uuid\n  title\n  slug\n  sunk\n  chargeType\n  status\n  identifier\n  canEdit\n  canSee\n  reactionType\n  reactionsV2 {\n    count\n    reactionType\n    __typename\n  }\n  tags {\n    name\n    nameTranslated\n    slug\n    tagType\n    __typename\n  }\n  createdAt\n  thumbnail\n  author {\n    username\n    profile {\n      userAvatar\n      userSlug\n      realName\n      __typename\n    }\n    __typename\n  }\n  summary\n  topic {\n    id\n    commentCount\n    viewCount\n    __typename\n  }\n  byLeetcode\n  isMyFavorite\n  isMostPopular\n  isEditorsPick\n  hitCount\n  videosInfo {\n    videoId\n    coverUrl\n    duration\n    __typename\n  }\n  __typename\n}\n'
    })
    const markdown = commentData.data.data.solutionArticle.content
    await this.reply(markdown)
    const markdownHtml = md.render(markdown)
    let data = {
      markdownHtml,
      tplFile: `${__dirname}/markdown.html`
    }
    let img = await puppeteer.screenshot('markdown', data)
    await this.reply(img)
  }
}
