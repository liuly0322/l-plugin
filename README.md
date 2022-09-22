<div align="center">
  
# L-Plugin

</div>

<p align="center">

  <a href="https://github.com/liuly0322/l-plugin/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/liuly0322/l-plugin?color=blue">
  </a>

  <a href="https://github.com/liuly0322/l-plugin/actions/workflows/test.yml">
    <img src="https://github.com/liuly0322/l-plugin/actions/workflows/test.yml/badge.svg?branch=main">
  </a>

  <a href="https://www.codefactor.io/repository/github/liuly0322/l-plugin">
    <img src="https://img.shields.io/codefactor/grade/github/liuly0322/l-plugin/main">
  </a>

</p>

## 简介

L-Plugin 是一个 [Yunzai-Bot](https://github.com/Le-niao/Yunzai-Bot) 的功能插件

安装后发送 help 查看具体功能

- 「塔罗牌」占卜
  - 安装时不自带图片资源，每次下载完后会缓存图片在本地 `./data/tarots` 下
  - 图片使用 `fastgit` 加速，如果总是失败可以考虑参考该功能 [原项目](https://github.com/MinatoAquaCrews/nonebot_plugin_tarot) 的 README 下载资源文件，保存在 `./data/tarots` （相对本项目安装路径）下
  - 如果有图片资源损坏也可以通过本方法手动替换文件修复
- 「每日一题」LeetCode 每日一题
- 「随机一题(easy/medium/hard)」LeetCode 随机一题
  - 如：`随机一题hard`
- 「今日/昨日题解」查看答案
- 「r/roll」骰子
  - `r (随便什么文本，可以为空) a b` 即在 a 和 b 之间 roll 一个数字
  - `roll a b c` 即随机选出 a, b, c 中的一个
- 「(咱)今天吃什么」美食推荐
  - 今天吃什么会考虑基本菜单和群菜单
  - 咱今天吃什么只考虑群菜单
- 「添加/删除食物」更改群菜单，后面接食物（可以有多个，空格分隔）
  - 如：`添加食物 kfc 麦当当`
- 「tex」生成公式对应图片
  - 如：`tex 1+1=2`
- 「markdown」同上
- 「python」隔离运行代码
  - 需要额外配置 docker
- 「求签」鸣神大社抽签

help 指令默认覆盖了 Yunzai 的帮助，如需查看原有帮助可发送 `帮助`

## 安装

L-Plugin 需要最新版本（V3）的 Yunzai-Bot，请确认 Yunzai-Bot 已升级至最新版

在 BOT 根目录文件夹打开终端，运行

```
git clone https://github.com/liuly0322/l-plugin.git ./plugins/l-plugin/
```

随后进入本插件的文件夹，使用 `pnpm` 安装依赖：

```
cd plugins/l-plugin
pnpm install
```

如果需要启用运行 python 代码的功能，继续执行:

```
cd docker
sudo docker build -t ubuntu-python-playground-img .
```

## to be done

- 每日一题推送

## 声明

部分素材来自于网络，尽量遵循原协议，如有侵权请联系

## 参考项目

- [Yunzai-Bot](https://github.com/Le-niao/Yunzai-Bot)
- [Miao-Plugin](https://github.com/yoimiya-kokomi/Miao-plugin)
- [nonebot_plugin_tarot](https://github.com/MinatoAquaCrews/nonebot_plugin_tarot)
