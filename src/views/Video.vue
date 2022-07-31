<template>
  <div class="video">
    <div class="header">名师讲堂</div>
    <!--视频内容区域-->
    <div class="video-content">
      <!--视频列表区域-->
      <div class="video-item" v-for="(item, index) in videos" :key="index" @click="toVideoDetail(item.videoId)">
        <!--视频封面区域-->
        <div class="video-item-img">
          <img :src="item.videoCover"/>
          <div class="video-item-model">
            <span class="iconfont icon-bofang1"></span>
          </div>
        </div>
        <!--视频标题区域-->
        <div class="video-item-title">
          <span class="video-item-title-tag" v-if="item.videoType === 0">微课</span>
          <span class="video-item-title-tag" v-if="item.videoType === 1">教程</span>
          <span class="video-item-title-tag" v-if="item.videoType === 2">其他</span>
          <span class="video-item-title-text">{{ item.videoName }}</span>
        </div>
        <!--视频其他信息区域-->
        <div class="video-item-footer">
          <div class="video-item-footer-left">
            <div>发布人：{{ item.teacherName }}</div>
            <div>发布时间：{{ formatTimer(item.createTime) }}</div>
          </div>
          <div class="video-item-footer-right">
            <!--点赞图标-->
            <span class="iconfont icon-dianzan"></span>&nbsp;
            <!--点赞数-->
            <span>{{item.videoLikeNumber}}</span>&nbsp;&nbsp;
            <!--评论图标-->
            <span class="iconfont icon-pinglun1"></span>&nbsp;
            <!--评论数-->
            <span>{{item.videoCommentNumber}}</span>
          </div>
        </div>
        <!--底部横线-->
        <div class="video-content-line"></div>
      </div>
    </div>
    <!--查看更多按钮-->
    <div v-if="currentPage < pageTotal" class="video-content-button">
      <button type="button" @click="seeMore">查看更多</button>
    </div>
    <div v-else class="video-content-nodata">没有更多数据了~</div>
  </div>
</template>

<script>
export default {
  name: 'Video',
  data () {
    return {
      currentPage: 1,
      pageSize: 1,
      pageTotal: 0,
      // 接受数据数组
      videos: []
    }
  },
  methods: {
    // 请求后端查询视频列表
    loadVideos () {
      // 使用axios的get请求后端，参数为：currentPage（当前页），pageSize（页大小）
      this.$axios.get('/businessVideo/pageVideos', {
        params: {
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
      }).then(res => {
        console.log(res)
        // 获取查询出来的数据，并赋值给data
        const data = res.data.object
        if (data && data.videos) {
          // 令查询出来的视频数据赋值给this.videos
          // concat: 数组拼接
          this.videos = this.videos.concat(data.videos)
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
      // 执行请求后端查询视频方法
      this.loadVideos()
    },
    // 根据视频ID跳转到详情页面
    toVideoDetail (videoId) {
      this.$router.push({ path: '/video/detail', query: { videoId: videoId } })
    }
  },
  mounted () {
    this.loadVideos()
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
  .video-content {
    padding: 10px;
  }
  .video-item-img {
    position: relative;
  }
  .video-item-img img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
  .video-item-model {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .video-item-model span {
    font-size: 45px;
    color: #FFFFFF;
  }
  .video-item-title {
    display: flex;
    flex-direction: row;
    margin-top: 5px;
    align-items: center;
  }
  .video-item-title-tag {
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
  .video-item-title-text {
    font-size: 16px;
    font-weight: bold;
    margin-left: 10px;
  }
  .video-item-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
  .video-item-footer-left {
    margin-top: 10px;
  }
  .video-item-footer-left div {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.8);
  }
  .video-item-footer-right span {
    font-size: 14px;
  }
  .video-content-line {
    margin: 15px 0;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.05);
  }
  .video-content-button button {
    width: 100%;
    height: 38px;
    border: 1px solid #FF5555;
    background: #FFFFFF;
    color: #FF5555;
    font-size: 14px;
    font-weight: bold;
    border-radius: 8px;
  }
  .video-content-nodata {
    text-align: center;
    margin-bottom: 20px;
  }
</style>
