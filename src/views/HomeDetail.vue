<template>
  <div class="home-details">
    <!--头部红色区域-->
    <div class="header">头条详情</div>
    <!--左边返回按钮-->
    <div class="return" @click="toHome">&lt;</div>
    <!--内容区域-->
    <div class="detail">
      <!--新闻标题-->
      <div class="title">{{ news.newTitle }}</div>
      <!--作者和创建时间-->
      <div class="author">
        {{ news.creator }}&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ formatTimer(news.createTime) }}</span>
      </div>
      <!--新闻详情-->
      <div class="content" v-html="news.newDetail"></div>
      <!--点赞按钮-->
      <div class="like-button">
        <!--:class 改变点赞按钮为未点赞按钮样式-->
        <button :class="showActive ? 'like-button-active' : ''" type="button" @click="addOrDeleteLike"><span class="iconfont icon-dianzan"></span>&nbsp;点赞</button>
      </div>
      <!--横线-->
      <div class="home-details-line"></div>
      <!--评论内容显示区域-->
      <div class="comment">
        <!--精彩评论区域-->
        <div class="comment-title">精彩评论</div>
        <!--内容区域-->
        <div class="comment-content" v-for="(item, index) in comments" :key="index">
          <span class="comment-name">{{ item.userName }}: </span>
          <span>{{ item.commentContent }}</span>
        </div>
      </div>
      <!--查看更多按钮-->
      <div class="home-content-button" v-if="currentPage < pageTotal">
        <button type="button" @click="seeMore">查看更多</button>
      </div>
      <!--没有更多数据显示区域-->
      <div class="home-content-nodata" v-else>没有更多数据了~</div>
      <!--横线-->
      <div class="home-details-line"></div>
      <!--评论按钮-->
      <div class="comment-button">
        <button type="button" @click="showComment">评论</button>
      </div>
    </div>
    <!--显示评论输入区域-->
    <div class="modal" v-if="showModal">
      <div class="modal-other" @click="showComment"></div>
      <div class="modal-content">
        <div class="modal-textarea">
          <textarea placeholder="请输入评论内容" rows="3" v-model="commentContent"></textarea>
        </div>
        <div class="comment-button modal-comment">
          <button type="button" @click="addComment">评论</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 点赞按钮是否激活状态
      showActive: false,
      // 显示评论模态框
      showModal: false,
      // 用户ID
      userId: 0,
      // 用户类型
      userType: '',
      // 新闻ID
      newId: 0,
      // 新闻对象
      news: {},
      // 当前页
      currentPage: 1,
      // 页大小
      pageSize: 3,
      // 总页数
      pageTotal: 0,
      // 评论内容数组
      comments: [],
      // 输入的评论内容
      commentContent: ''
    }
  },
  methods: {
    showComment () {
      this.showModal = !this.showModal
    },
    // 根据新闻ID查询新闻详情
    loadNewDetailByNewId () {
      // 使用axios的get请求后端数据（参数为newId（新闻ID））
      this.$axios.get('/businessNew/getNewByNewId', {
        params: {
          newId: this.newId
        }
      }).then(res => {
        console.log(res)
        // 令查询出来的数据赋值给this.news
        this.news = res.data.object
      })
    },
    // 加载当前用户点赞数据
    loadLikeInfo () {
      // 使用axios的get请求后端（参数为：newId（新闻ID）,userId（用户ID），userType（用户类型））
      this.$axios.get('/businessNewLike/getNewLikeByUserIdAndNewId', {
        params: {
          newId: this.newId,
          userId: this.userId,
          userType: this.userType
        }
      }).then(res => {
        // 判断返回的数据是否为空
        if (res.data.object) {
          // 如果存在数据则令点赞按钮改变样式
          this.showActive = true
        } else {
          // 否则，不添加高亮样式
          this.showActive = false
        }
      })
    },
    // 点赞或取消点赞触发事件
    addOrDeleteLike () {
      // 使用axios的post请求后端数据（参数为：newId（新闻ID）,userId（用户ID），userType（用户类型））
      this.$axios.post('/businessNewLike/addDeleteLike', {
        newId: this.newId,
        userId: this.userId,
        userType: this.userType
      }).then(res => {
        // 令查询出来的数据赋值给data
        const data = res.data.object
        // 提示成功失败数据
        alert(data.message)
        // 重新查询点赞信息，更新点赞按钮样式
        this.loadLikeInfo()
      })
    },
    // 根据新闻ID分页查询新闻评论内容
    loadNewComment () {
      // 使用axios的get请求后端（参数为：newId（新闻ID）,currentPage（当前页），pageSize（页大小））
      this.$axios.get('/businessNewComment/pageComments', {
        params: {
          newId: this.newId,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
      }).then(res => {
        // 令查询出来的数据赋值给data
        const data = res.data.object
        // 判断查询出来的数据为空
        if (data && data.comments) {
          // 把查询出来的数据添加到this.comments的集合里面
          this.comments = this.comments.concat(data.comments)
          // 把查询出来的总页数赋值给this.pageTotal
          this.pageTotal = data.pageTotal
        }
      })
    },
    // 查看更多按钮点击事件
    seeMore () {
      // 令当前页加一
      this.currentPage++
      //  执行请求后端查询评论方法
      this.loadNewComment()
    },
    // 添加评论方法
    addComment () {
      if (!this.commentContent) {
        alert('请输入评论内容')
        return
      }
      // 使用axios的get请求后端（参数为：newId（新闻ID）,userId（用户ID），userType（用户类型），commentContent（评论内容））
      this.$axios.post('/businessNewComment/addComment', {
        newId: this.newId,
        userId: this.userId,
        userType: this.userType,
        commentContent: this.commentContent
      }).then(res => {
        console.log(1)
        console.log(res)
        // 令查询出来的数据赋值给data
        const data = res.data
        if (data.status) {
          alert('评论成功')
          // 把模态框隐藏
          this.showComment()
          // 令当前页等于1
          this.currentPage = 1
          // 把评论内容清空
          this.comments = []
          // 重新加载评论内容
          this.loadNewComment()
        } else {
          alert('评论失败')
        }
      })
    },
    // 点击返回按钮触发事件
    toHome () {
      // 点击跳转到首页
      this.$router.push({ path: '/home' })
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
      let m = date.getHours()
      // 判断如果分小于10时，在日前面加一个0
      m = m < 10 ? '0' + m : m
      // 获取秒
      let s = date.getHours()
      // 判断如果秒小于10时，在日前面加一个0
      s = s < 10 ? '0' + s : s
      // 拼接日期格式输出
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    }
  },
  mounted () {
    // 获取存放在sessionStorage的userId
    const userId = window.sessionStorage.getItem('userId')
    // 获取存放在sessionStorage的userType
    const userType = window.sessionStorage.getItem('userType')
    if (!userId) {
      alert('无法获取用户信息')
    }
    // 令获取出来的userId赋值给this.userId
    this.userId = userId
    // 令获取出来的userType赋值给this.userType
    this.userType = userType
    // 获取路由传过来的所有参数
    const query = this.$route.query
    // 判断参数里面是否存在newId（新闻ID）
    if (Object.prototype.hasOwnProperty.call(query, 'newId')) {
      // 如果存在newId新闻ID，则把新闻ID的值获取出来赋值给this.newId
      this.newId = query.newId
    }
    // 加载根据新闻ID查询新闻详情
    this.loadNewDetailByNewId()
    // 查询当前用户点赞信息
    this.loadLikeInfo()
    // 加载新闻评论数据
    this.loadNewComment()
  }
}
</script>

<style>
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
.detail {
  padding: 15px;
}
.title {
  font-size: 16px;
  font-weight: bold;
}
.author {
  font-size: 14px;
  font-weight: bold;
  margin-top: 15px;
}
.author span {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
}
.content {
  font-size: 14px;
  margin-top: 15px;
  word-break: break-all;
}
.content img {
  width: 100% !important;
}
.like-button {
  margin-top: 15px;
}
.like-button button {
  width: 100%;
  height: 38px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  background: #FFFFFF;
  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
  font-weight: bold;
  border-radius: 8px;
}
.like-button-active {
  border: 1px solid #FF5555 !important;
  color: #FF5555 !important;
}
.home-details-line {
  margin-top: 15px;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.05);
}
.comment {
  margin-top: 15px;
}
.comment .comment-title {
  font-size: 16px;
  font-weight: bold;
}
.comment-content {
  font-size: 14px;
  margin: 15px;
}
.comment-name {
  font-weight: bold;
  color: #FF5555;
}
.home-content-button button {
  width: 100%;
  height: 38px;
  border: 1px solid #FF5555;
  background: #FFFFFF;
  color: #FF5555;
  font-size: 14px;
  font-weight: bold;
  border-radius: 8px;
}
.home-content-nodata {
  text-align: center;
}
.comment-button {
  margin-top: 15px;
}
.comment-button button {
  width: 100%;
  height: 38px;
  border: 1px solid #FF5555;
  background: #FF5555;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: bold;
  border-radius: 8px;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
}
.modal-other {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh - 240px);
}
.modal-content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 240px;
  background: #FFFFFF;
  padding: 0 auto;
}
.modal-textarea {
  display: flex;
  justify-content: center;
}
.modal-textarea textarea {
  height: 140px;
  width: 90%;
  margin-top: 10px;
  padding: 10px;
  border: none;
}
.modal-comment {
  margin: 10px;
}
</style>
