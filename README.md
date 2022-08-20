<div align="center">
  
# L-Plugin

</div>

<p align="center">

  <a href="https://github.com/liuly0322/l-plugin/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/liuly0322/l-plugin?color=blue">
  </a>
  
  <a href="https://www.codefactor.io/repository/github/liuly0322/l-plugin">
    <img src="https://img.shields.io/codefactor/grade/github/liuly0322/l-plugin/main">
  </a>
  
</p>

## 简介

L-Plugin 是一个 [Yunzai-Bot](https://github.com/Le-niao/Yunzai-Bot) 的功能插件

目前因为是自用的，所以安装完后会替换默认帮助信息，通过 `#云崽帮助` 查看原有帮助信息

具体功能（发送 help 查看）：

- 「塔罗牌」占卜
- 「每日一题」LeetCode 每日一题
- 「随机一题(easy/medium/hard)」LeetCode 随机一题
- 「今日/昨日题解」查看答案
- 「r/roll」骰子
- 「(咱)今天吃什么」美食推荐
- 「添加/删除食物」更改群菜单
- 「tex」生成公式对应图片
- 「markdown」同上
- 「python」隔离运行代码
- 「求签」来鸣神大社抽签

## 使用说明

L-Plugin 需要最新版本（V3）的 Yunzai-Bot，请确认 Yunzai-Bot 已升级至最新版

## 安装

推荐使用 git 进行安装。在 BOT 根目录文件夹打开终端，运行

```
// 使用github
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

# 免责声明

图片与其他素材均来自于网络，仅供交流学习使用，如有侵权请联系，会立即删除

# 参考项目

- [Yunzai-Bot](https://github.com/Le-niao/Yunzai-Bot)
- [Miao-Plugin](https://github.com/yoimiya-kokomi/Miao-plugin)
- [nonebot_plugin_tarot](https://github.com/MinatoAquaCrews/nonebot_plugin_tarot)
