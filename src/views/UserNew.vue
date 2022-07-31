<template>
  <div>
    <!--头部红色区域-->
    <div class="header">{{ type === 0 ? '我点赞的新闻' : '我评论的新闻' }}</div>
    <!--左边返回按钮-->
    <div class="return" @click="toPersonal">&lt;</div>
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserNew',
  data () {
    return {
      // 类型【0：我点赞过的新闻，1：我评论过的新闻】
      type: Number(this.$route.query.type),
      // 用户姓名
      userId: window.sessionStorage.getItem('userId'),
      // 用户类型
      userType: window.sessionStorage.getItem('userType'),
      news: []
    }
  },
  methods: {
    // 点击返回按钮触发事件
    toPersonal () {
      // 点击跳转到光大之友
      this.$router.push({ path: '/personal' })
    },
    // 查询我点赞/评论的新闻列表
    listNewsByUserId () {
      let url = ''
      // 判断是否为我点赞的新闻
      if (this.type === 0) {
        // 如果是则请求我点赞的新闻连接
        url = '/businessNew/listNewsByLikeUserId'
      } else if (this.type === 1) {
        // 否则请求我评论的新闻连接
        url = '/businessNew/listNewsByCommentUserId'
      }
      this.$axios.get(url, {
        params: {
          userId: this.userId,
          userType: this.userType
        }
      }).then(res => {
        // 把查询出来的结果赋值给this.news
        this.news = res.data.object
      })
    },
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
    homeContentClick (newId) {
      this.$router.push({ path: '/home/Detail', query: { newId: newId } })
    }
  },
  mounted () {
    this.listNewsByUserId()
  }
}
</script>

<style scoped="scoped">
.home-details {
  position: relative;
}
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
.return {
  position: absolute;
  top: 8px;
  left: 10px;
  color: #FFFFFF;
  font-size: 20px;
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
