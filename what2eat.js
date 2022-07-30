import plugin from '../../lib/plugins/plugin.js'

const basic_food = [
  '肯德基',
  '麦当劳',
  '汉堡王',
  '艾比克',
  '必胜客',
  '方便面',
  '鸡排',
  '一点点',
  '赤坂亭',
  '卡旺卡',
  '烤冷面',
  '手抓饼',
  '东区东苑餐厅',
  '东区风味餐厅',
  '东区星座餐厅',
  '东区学生餐厅',
  '东区美食广场',
  '西区学生餐厅',
  '西区西苑餐厅',
  '西区芳华餐厅',
  '西区西三餐厅',
  '西区金桔园',
  '西区正阳楼',
  '中区桃李苑',
  '老乡鸡',
  '紫燕百味鸡',
  '东北王食府',
  '无锡汤包',
  '巴蜀人家',
  '老地方川菜馆',
  '鸡公煲',
  '淮南牛肉汤',
  '小高米线',
  '肥叔锅贴',
  '量子咖啡',
  '来一杯',
  '费比欧',
  '蒸小皖',
  '张亮麻辣烫',
  '杨国福麻辣烫',
  '庐州太太',
  '漫乐城',
  '香辣虾',
  '海底捞',
  '沙县小吃',
  '凉白开',
  '麻辣香锅',
  '西红柿炒鸡蛋',
  '地三鲜',
  '水煮肉片',
  '回锅肉',
  '糖醋里脊',
  '葱煎豆腐',
  '鱼香肉丝',
  '糖醋里脊',
  '辣椒炒肉',
  '孜然牛肉',
  '香菜牛肉',
  '小炒肉',
  '洋葱炒肉',
  '酸辣土豆丝',
  '醋溜土豆丝',
  '可乐鸡翅',
  '酱牛肉',
  '过桥米线',
  '鱼',
  '小酥肉',
  '锅包肉',
  '粉蒸肉',
  '红烧肉',
  '红烧茄子',
  '粉蒸排骨',
  '梅菜扣肉',
  '土豆炖牛肉',
  '蛋炒饭',
  '面条',
  '土家酱香饼',
  '孔府一品锅',
  '尼克斯',
  '鱼杂火锅',
  '淮南粉丝汤',
  '哨子面',
  '肥西路小摊',
  '烧烤',
  '隐创',
  '老火',
  '罗森',
  '华莱士',
  '瑞幸咖啡',
  '采蝶轩',
  '皖北地锅鸡',
  '淮河路步行街',
  '泡面',
  '肉夹馍',
  '重庆小面',
  '🍮',
  '🍕',
  '詹记',
  '小鸡炖蘑菇',
  '鸡米饭',
  '老北京鸡肉卷',
  '🍔',
  '🍞',
  '🌭',
  '🥘',
  '🍟',
  '🍜',
  '🍤',
  '🥮',
  '🍨🍦🍧',
  '包子',
  '鱼杂',
  '牛杂',
  '西区学生食堂一楼小火锅',
  '东区星座酸菜鱼',
  '西苑猪肚鸡',
  '芳华黄焖鸡',
  '东区美食广场无骨鱼/烤鱼饭',
  '绿豆薏米粥',
]

export class what2eat extends plugin {
  constructor() {
    super({
      name: 'what2eat',
      dsc: '今天吃什么',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^咱?(今天|明天|[早中午晚][上饭餐午]|早上|夜宵|今晚)吃(什么|啥|点啥)',
          fnc: 'what2eat',
        },
        {
          reg: '^添加食物',
          fnc: 'addFood',
        },
        {
          reg: '^删除食物',
          fnc: 'deleteFood',
        },
      ],
    })
  }
  
  async validate() {
    if (!this.e.isGroup) {
      this.reply('请群聊发送')
      return false
    }
    return true
  }
  
  getKey () {
    return `Yz:what2eat:foods:${this.e.group_id}`
  }
  
  async addFood() {
    if (!this.validate()) return
    const key = this.getKey()
    const foods = this.e.msg.split(' ').slice(1)
    foods.forEach(async (food) => {
      await redis.sAdd(key, food)
    })
    await this.reply('添加成功！')
  }

  async deleteFood() {
    if (!this.validate()) return
    const key = this.getKey()
    const foods = this.e.msg.split(' ').slice(1)
    foods.forEach(async (food) => {
      await redis.sRem(key, food)
    })
    await this.reply('删除成功！')
  }

  async what2eat() {
    let food = basic_food
    if (this.validate()) {
      const key = this.getKey()
      const group_food = await redis.sMembers(key)
      food = this.e.msg.split(' ')[0]?.includes('咱')
        ? group_food
        : [...basic_food, ...group_food]
    }
    

    if (!food || food.length == 0) return

    const results = new Array(5)
      .fill('')
      .map(() => food[Math.floor(Math.random() * food.length)])
    const result = results.join('|')
    await this.reply(`推荐尝试：${result}`, false, { at: true })
  }
}
