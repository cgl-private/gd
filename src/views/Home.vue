<template>
  <div class="home">
    <!--头部红色区域 （头部标题）-->
    <div class="header">光大教育软件研究院</div>
    <!--头部tab频道选项卡-->
    <div class="header-tabs-parent">
      <ul class="header-tabs">
        <li class="header-tabs-item" v-for="(item, index) in tabsData" :key="index"
        @click="toggleTabs(index, item.channelId)" :class="{ 'header-tabs-item-active' : index == currentIndex }">{{item.channelName}}</li>
      </ul>
      <!--频道右边的加号-->
      <div class="header-tabs-right">+</div>
    </div>
    <!--轮播图区域-->
    <Swiper class="swiper" v-if="banners.length > 0">
      <Slide v-for="(item, index) in banners" :key="index">
        <img :src="item.bannerImg"/>
      </Slide>
    </Swiper>
    <!--新闻内容区域-->
    <div class="home-content">
      <!--每一条内容选项-->
      <div v-for="(item,index) in news" :key="index" class="home-content-item"
      @click="homeContentClick(item.newId)">
        <!--新闻内容标题-->
        <div class="home-content-title">
          <!--新闻类型-->
          <span class="home-content-title-tag">
            <template v-if="item.newType === 0">头条</template>
            <template v-if="item.newType === 1">视频</template>
            <template v-if="item.newType === 2">活动</template>
          </span>
          <!--新闻标题文字-->
          <span class="home-content-title-text">{{item.newTitle}}</span>
        </div>
        <!--新闻封面图片-->
        <div class="home-content-images">
          <template v-if="item.newCover">
            <!--新闻封面图片为单图时，使用home-content-images-img1样式-->
            <template v-if="item.newCover.split('、').length === 1" >
              <img :src="item.newCover" class="home-content-images-img1" />
            </template>
            <!--新闻封面图片为二图时，使用home-content-images-img2样式-->
            <template v-if="item.newCover.split('、').length === 2" class="home-content-images-img2">
              <img v-for="(img, imgIndex) in item.newCover.split('、')" :key="imgIndex" :src="img"
              class="home-content-images-img2" />
            </template>
            <!--新闻封面图片为二图时，使用home-content-images-img3样式-->
            <template v-if="item.newCover.split('、').length === 3" class="home-content-images-img3">
              <img v-for="(img, imgIndex) in item.newCover.split('、')" :key="imgIndex" :src="img"
              class="home-content-images-img3" />
            </template>
          </template>
        </div>
        <!--每条新闻内容底部-->
        <div class="home-content-footer">
          <!--每条新闻内容底部左边时间显示区域-->
          <div class="home-content-footer-left">{{formatTimer(item.createTime)}}</div>
          <!--每条新闻内容底部右边点赞数，评论数显示区域-->
          <div class="home-content-footer-right">
            <!--点赞图标-->
            <span class="iconfont icon-dianzan"></span>&nbsp;
            <!--点赞数-->
            <span>{{item.newLikeNumber}}</span>&nbsp;&nbsp;
            <!--评论图标-->
            <span class="iconfont icon-pinglun1"></span>&nbsp;
            <!--评论数-->
            <span>{{item.newCommentNumber}}</span>
          </div>
        </div>
        <!--底部横线-->
        <div class="home-content-line"></div>
      </div>
      <!--查看更多按钮-->
      <div v-if="currentPage < pageTotal" class="home-content-button">
        <button type="button" @click="seeMore">查看更多</button>
      </div>
      <!--没有更多数据显示区域-->
      <div v-else class="home-content-nodata">
        没有更多数据了~
      </div>
    </div>
  </div>
</template>

<script>
// 引入轮播图组件
import { Swiper, Slide } from 'vue-swiper-component'
export default {
  name: 'Home',
  // 注册组件
  components: {
    Swiper,
    Slide
  },
  data () {
    return {
      // 频道选项卡集合
      tabsData: [],
      // 频道选项卡当前选中频道Id（用于查询数据）
      currentChannelId: 0,
      // 频道选项卡当前选中索引
      currentIndex: 0,
      // 轮播图集合
      banners: [],
      // 当前页
      currentPage: 1,
      // 总页数
      pageSize: 1,
      // 新闻内容
      pageTotal: 0,
      // 新闻内容
      news: []
    }
  },
  methods: {
    // 请求后端查询频道选项卡
    loadChannel () {
      // 使用axios的get请求后端
      this.$axios.get('/baseChannel/listChannels').then(res => {
        console.log(res)
        // 把查出来的数据赋值给this.tabsData
        this.tabsData = res.data.object
        // 判断查出来的数据是否大于0条
        if (this.tabsData && this.tabsData.length > 0) {
          // 令当前频道选项卡ID等于查出来数据的第一条频道ID
          this.currentChannelId = this.tabsData[0].channelId
          // 执行请求后端查询新闻内容方法
          this.loadNews()
        }
      })
    },
    // 点击频道选项卡事件
    toggleTabs (index, channelId) {
      // 把频道选项卡点击索引赋值给this.currentIndex
      this.currentIndex = index
      // 把频道选项卡点击ID赋值给this.currentChannelId
      this.currentChannelId = channelId
      // 令新闻内容为空数组
      this.news = []
      // 令总页数等于0
      this.pageTotal = 0
      // 令当前页等于1
      this.currentPage = 1
      // 执行请求后端查询新闻内容方法
      this.loadNews()
    },
    // 请求后端查询轮播图
    loadBanner () {
      this.$axios.get('/baseBanner/listBanners').then(res => {
        this.banners = res.data.object
        console.log(res)
      })
    },
    // 请求后端查询新闻列表
    loadNews () {
      // 使用axios的get请求后端，参数为：channelId（频道ID），currentPage（当前页），pageSize（页大小）
      this.$axios.get('/businessNew/pageNews', {
        params: {
          channelId: this.currentChannelId,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
      }).then(res => {
        console.log(res)
        // 获取查询出来的数据，并赋值给data
        const data = res.data.object
        if (data && data.news) {
          // 令查询出来的新闻数据赋值给this.news
          // concat: 数组拼接
          this.news = this.news.concat(data.news)
          // 令查询出来的总页数赋值给总页数
          this.pageTotal = data.pageTotal
        }
      })
    },
    // 格式化日期方法
    formatTimer (value) {
      // 把时间戳转换为时间对象
      const date = new Date(value)
      // 获取年份
      const y = date.getFullYear()
      // 获取月份
      let MM = date.getMonth() + 1
      // 判断如果月份小于10时，在月份前面加一个0
      MM = MM < 10 ? '0' + MM : MM
      // 获取日
      let d = date.getDate()
      // 判断如果日小于10时，在日前面加一个0
      d = d < 10 ? '0' + d : d
      // 获取时
      let h = date.getHours()
      // 判断如果时小于10时，在日前面加一个0
      h = h < 10 ? '0' + h : h
      // 获取分
      let m = date.getMinutes()
      // 判断如果分小于10时，在日前面加一个0
      m = m < 10 ? '0' + m : m
      // 获取秒
      let s = date.getSeconds()
      // 判断如果秒小于10时，在日前面加一个0
      s = s < 10 ? '0' + s : s
      // 拼接日期格式输出
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    },
    // 查看更多按钮点击事件
    seeMore () {
      // 令当前页加一
      this.currentPage++
      // 执行请求后端查询新闻内容方法
      this.loadNews()
    },
    homeContentClick (newId) {
      this.$router.push({ path: '/home/Detail', query: { newId: newId } })
    }
  },
  // 组件加载完成时触发的钩子函数
  mounted () {
    // 执行请求后端查询频道选项卡方法
    this.loadChannel()
    // 执行请求后端查询轮播图方法
    this.loadBanner()
  }
}
</script>

<style scoped="scoped">
.header {
  height: 44px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: bold;
  background-image: linear-gradient(-90deg, #ff4242 0%, #ff6451 100%);
}
.header-tabs-parent {
  display: flex;
  flex-direction: row;
}
.header-tabs {
  height: 40px;
  width: calc(100% - 40px);
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  padding: 0;
  margin: 0;
}
.header-tabs-item {
  font-size: 14px;
  color: black;
  line-height: 40px;
  white-space: nowrap;
  padding: 0 20px;
  display: inline-block;
}
.header-tabs-item-active {
  color: #FF5555;
  font-weight: bold;
}
.header-tabs-right {
  height: 40px;
  width: 40px;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}
.swiper img {
  height: 200px;
  width: 100%;
  object-fit: cover;
}
.home-content {
  margin: 15px;
}
.home-content-title {
  display: flex;
  flex-direction: row;
}
.home-content-title-tag {
  font-size: 12px;
  color: #FF5555;
  width: 40px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #FF5555;
  border-radius: 5px;
}
.home-content-title-text {
  margin-left: 10px;
  line-height: 28px;
  font-size: 16px;
  font-weight: bold;
  display: inline-block;
  white-space: nowrap;
  width: calc(100% - 60px);
  overflow: hidden;
  text-overflow: ellipsis;
}
.home-content-images {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.home-content-images-img1 {
  width: 100%;
  height: 140px;
  object-fit: cover;
}
.home-content-images-img2 {
  width: 48%;
  height: 100px;
  object-fit: cover;
}
.home-content-images-img3 {
  width: 31%;
  height: 70px;
  object-fit: cover;
}
.home-content-footer {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.home-content-footer .home-content-footer-left {
  text-align: left;
}
.home-content-footer .home-content-footer-right {
  text-align: right;
}
.home-content-footer .home-content-footer-right,.home-content-footer-left {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
}
.home-content-line {
  margin: 10px 0 15px 0;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.05);
}
.home-content-button button {
  width: 100%;
  height: 38px;
  border: 1px solid #FF5555;
  background: #FFFFFF;
  font-size: 14px;
  font-weight: bold;
  border-radius: 8px;
}
.home-content-nodata {
  text-align: center;
}
</style>
