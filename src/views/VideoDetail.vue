<template>
  <div class="video-detail">
    <!--头部区域-->
    <div class="video-detail-header">
      <!--头部红色区域-->
      <div class="header">讲堂详情</div>
      <!--左边返回按钮-->
      <div class="return" @click="toVideo">&lt;</div>
    </div>
    <!--视频播放区域-->
    <div class="video-detail-video">
      <video ref="video" :src="videoUrl" controls="controls"></video>
    </div>
    <!--tab选项卡区域-->
    <ul class="video-detail-tabs">
      <li class="video-detail-tabs-item" @click="toggleTabs(0)"
      :class="{ 'video-detail-tabs-item-active' : 0 === currentIndex }">介绍</li>
      <li class="video-detail-tabs-item" @click="toggleTabs(1)"
      :class="{ 'video-detail-tabs-item-active' : 1 === currentIndex }">目录</li>
      <li class="video-detail-tabs-item" @click="toggleTabs(2)"
      :class="{ 'video-detail-tabs-item-active' : 2 === currentIndex }">评论</li>
    </ul>
    <!--介绍内容区域-->
    <div class="video-detail-info" v-if="currentIndex === 0">
      <div class="video-detail-info-title">{{ video.videoName }}</div>
      <div class="video-detail-info-content" v-html="video.videoInfo"></div>
      <!--点赞按钮-->
      <div class="like-button" @click="addOrDeleteVideoLike">
        <!--:class 改变点赞按钮为未点赞按钮样式-->
        <button type="button" :class="showActive ? 'like-button-active' : ''">
          <span class="iconfont icon-dianzan"></span>&nbsp;点赞
        </button>
      </div>
    </div>
    <!--目录内容区域-->
    <div class="video-detail-list" v-if="currentIndex === 1">
      <div class="video-detail-list-item" v-for="(item, index) in videoDetails" :key="index" @click="changVideoUrl(item.videoDetailUrl)">
        <i class="iconfont icon-bofang1"></i>&nbsp;&nbsp;
        <span>{{ item.videoDetailTitle }}</span>
      </div>
    </div>
    <!--评论区域-->
    <div class="video-detail-comment" v-if="currentIndex === 2">
      <div class="video-detail-comment-item" v-for="(item, index) in videoComments" :key="index">
        <span class="comment-name">{{ item.userName }}: </span>
        <span>{{ item.commentContent }}</span>
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
  name: 'VideoaDetail',
  data () {
    return {
      // 当前选中选项卡索引
      currentIndex: 0,
      // 视频链接
      videoUrl: '',
      // 视频ID
      videoId: '',
      showActive: false,
      userId: '',
      userType: '',
      video: {},
      // 视频详情
      videoDetails: [],
      // 当前页
      currentPage: 1,
      // 页大小
      pageSize: 3,
      // 总页数
      pageTotal: 0,
      // 评论内容数组
      videoComments: [],
      // 显示评论模态框
      showModal: false,
      // 输入的评论内容
      commentContent: ''
    }
  },
  methods: {
    // 点击返回按钮触发事件
    toVideo () {
      // 点击跳转到首页
      this.$router.push({ path: '/video' })
    },
    // 查看更多按钮点击事件
    seeMore () {
      // 令当前页加一
      this.currentPage++
      //  执行请求后端查询评论方法
      this.loadVideoComment()
    },
    showComment () {
      this.showModal = !this.showModal
    },
    // 点击视频详情选项卡调用不同的接口查询对应的数据
    toggleTabs (index) {
      this.currentIndex = index
      if (index === 0) {
        // 根据视频ID查询视频介绍
        this.loadVideoByVideoId()
      }
      if (index === 1) {
        // 根据视频ID查询视频详情
        this.loadVideoDetailByVideoId()
      }
    },
    // 根据视频ID查询视频介绍
    loadVideoByVideoId () {
      // 使用axios的get请求后端数据（参数为videoId（视频ID））
      this.$axios.get('/businessVideo/getVideoByVideoId', {
        params: {
          videoId: this.videoId
        }
      }).then(res => {
        console.log(res)
        this.video = res.data.object
      })
    },
    // 加载当前用户点赞数据
    loadLikeInfo () {
      // 使用axios的get请求后端（参数为：videoId（视频ID）,userId（用户ID），userType（用户类型））
      this.$axios.get('/businessVideoLike/getVideoLikeByUserIdAndVideoId', {
        params: {
          videoId: this.videoId,
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
    addOrDeleteVideoLike () {
      // 使用axios的post请求后端数据（参数为：videoId（视频ID）,userId（用户ID），userType（用户类型））
      this.$axios.post('/businessVideoLike/addDeleteLike', {
        videoId: this.videoId,
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
    // 根据视频ID查询视频详情
    loadVideoDetailByVideoId () {
      // 使用axios的get请求后端数据（参数为videoId（视频ID））
      this.$axios.get('/businessVideoDetail/listVideoDetails', {
        params: {
          videoId: this.videoId
        }
      }).then(res => {
        console.log(res)
        // 令查询出来的数据赋值给this.videoDetails
        this.videoDetails = res.data.object
        // 如果存在视频，则播放第一个视频
        if (this.videoDetails) {
          this.videoUrl = this.videoDetails[0].videoDetailUrl
        }
      })
    },
    // 点击目录的时候视频链接为第一个视频的链接
    changVideoUrl (videoDetailTitle) {
      this.videoUrl = videoDetailTitle
      // 使用ref对视频进行播放
      setTimeout(() => {
        this.$refs.video.play()
      }, 1000)
    },
    // 根据视频ID分页查询视频评论内容
    loadVideoComment () {
      // 使用axios的get请求后端（参数为：videoId（视频ID）,currentPage（当前页），pageSize（页大小））
      this.$axios.get('/businessVideoComment/pageVideoComments', {
        params: {
          videoId: this.videoId,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
      }).then(res => {
        console.log(res)
        // 令查询出来的数据赋值给data
        const data = res.data.object
        // 判断查询出来的数据为空
        if (data && data.videoComments) {
          // 把查询出来的数据添加到this.videoComments
          this.videoComments = this.videoComments.concat(data.videoComments)
          // 把查询出来的总页数赋值给this.pageTotal
          this.pageTotal = data.pageTotal
        }
      })
    },
    // 添加评论方法
    addComment () {
      if (!this.commentContent) {
        alert('请输入评论内容')
        return
      }
      // 使用axios的get请求后端（参数为：videoId（视频ID）,userId（用户ID），userType（用户类型），commentContent（评论内容））
      this.$axios.post('/businessVideoComment/addVideoComment', {
        videoId: this.videoId,
        userId: this.userId,
        userType: this.userType,
        commentContent: this.commentContent
      }).then(res => {
        // 令查询出来的数据赋值给data
        const data = res.data
        if (data.status) {
          alert('评论成功')
          // 把模态框隐藏
          this.showComment()
          // 令当前页等于1
          this.currentPage = 1
          // 把评论内容清空
          this.videoComments = []
          // 重新加载评论内容
          this.loadVideoComment()
        } else {
          alert('评论失败')
        }
      })
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
    // 判断参数里面是否存在videoId（视频ID）
    if (Object.prototype.hasOwnProperty.call(query, 'videoId')) {
      // 如果存在videoId新闻ID，则把视频ID的值获取出来赋值给this.videoId
      this.videoId = query.videoId
    }
    this.loadVideoByVideoId()
    this.loadLikeInfo()
    this.loadVideoDetailByVideoId()
    this.loadVideoComment()
  }
}
</script>

<style>
  .video-detail-header {
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
  .video-detail-video video {
    height: 210px;
    width: 100%;
    object-fit: fill;
  }
  .video-detail-tabs {
    height: 40px;
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 0;
    margin: 0;
  }
  .video-detail-tabs-item {
    font-size: 14px;
    color: black;
    line-height: 40px;
    white-space: nowrap;
    display: inline-block;
    width: 33.3333%;
    text-align: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
  .video-detail-tabs-item-active {
    color: #FF5555;
    font-weight: bold;
  }
  .video-detail-info {
    padding: 10px;
  }
  .video-detail-info-title {
    font-size: 16px;
    font-weight: bold;
  }
  .video-detail-info-content {
    font-size: 14px;
    margin-top: 15px;
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
  .video-detail-list {
    padding: 10px;
  }
  .video-detail-list-item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin-bottom: 10px;
  }
  .video-detail-list-item i {
    font-size: 16px;
  }
  .video-detail-list-item span {
    font-size: 14px;
  }
  .video-detail-comment {
    padding: 10px;
  }
  .video-detail-comment-item {
    margin-bottom: 10px;
  }
</style>
