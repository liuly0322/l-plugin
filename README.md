# L-Plugin 说明

L-Plugin 是一个 Yunzai-Bot 的偏向正常 QQ 机器人的功能插件

目前因为是写着玩的，所以安装完后会替换默认帮助信息，通过 `#云崽帮助` 查看原有帮助信息

本仓库依赖 (axios) 也使用 pnpm 管理，与 Yunzai-Bot 依赖独立

具体功能（发送 help 查看）：

- 「塔罗牌」占卜
  - 发送图片示例，通过 github 的 cdn 加速图片
- 「每日一题」LeetCode 每日一题
  - axios 示例
- 「r/roll」骰子
- 「(咱)今天吃什么」美食推荐
- 「添加/删除食物」更改群菜单
  - 通过使用 Redis 数据库实现

## 使用说明

L-Plugin 需要最新版本的 Yunzai-Bot，请确认 Yunzai-Bot 已升级至最新版

## 安装与更新

推荐使用 git 进行安装。在 BOT 根目录夹打开终端，运行

```
// 使用github
git clone https://github.com/yoimiya-kokomi/L-plugin.git ./plugins/l-plugin/
```

随后进入本插件的文件夹，使用 `pnpm` 安装依赖：

```
cd plugins/l-plugin
pnpm install
```

# 免责声明

1. 功能仅限内部交流与小范围使用，请勿将 Yunzai-Bot 及 L-Plugin 用于任何以盈利为目的的场景
2. 图片与其他素材均来自于网络，仅供交流学习使用，如有侵权请联系，会立即删除

# 其他

- [Yunzai-Bot](https://github.com/Le-niao/Yunzai-Bot)
- [Miao-Plugin](https://github.com/yoimiya-kokomi/Miao-plugin)
- [nonebot_plugin_tarot](https://github.com/MinatoAquaCrews/nonebot_plugin_tarot)
