<template>
   <div class="dynamic">
    <!--头部区域-->
    <div class="header">校园直达</div>
    <!--内容区域-->
    <div class="dynamic-content">
      <div class="dynamic-item" v-for="(item, index) in dynamics" :key="index">
        <div class="dynamic-item-head">
          <!--发布者头像-->
          <div class="dynamic-item-title">
            {{ item.userName.substring(0,1) }}
          </div>
          <!--发布者姓名和发布日期-->
          <div class="dynamic-item-right">
            <div class="dynamic-item-name">&nbsp;&nbsp;&nbsp;{{ item.userName }}</div>
            <div class="dynamic-item-time">&nbsp;&nbsp;&nbsp;{{ formatTimer(item.createTime) }}</div>
          </div>
        </div>
        <!--发布内容-->
        <div class="dynamic-item-content">
          {{item.dynamicContent}}
        </div>
        <!--发布图片-->
        <div class="dynamic-item-img" v-if="item.dynamicImg">
          <img v-for="(img, imgIndex) in item.dynamicImg.split(',')" :key="imgIndex" :src="$baseUrl + img"/>
        </div>
        <div class="dynamic-item-footer">
          <!--点赞图标-->
          <span :style="item.userLikeNumber > 0 ? { color: '#ff4242' } : {}" class="iconfont icon-dianzan" style="font-size: 18px;" @click="addOrDeleteDynamic(item.dynamicId, index)"></span>&nbsp;
          <!--点赞数-->
          <span>{{ item.likeNumber }}</span>&nbsp;&nbsp;
          <!--评论图标-->
          <span class="iconfont icon-pinglun1" style="font-size: 18px;"></span>&nbsp;
          <!--评论数-->
          <span>{{ item.commentNumber }}</span>
        </div>
        <!--底部横线-->
        <div class="dynamic-item-line"></div>
        <!--显示评论区域-->
        <div class="dynamic-item-comments">
          <div v-for="(comment, commentIndex) in item.businessDynamicCommentVOs" :key="commentIndex">
            <span class="dynamic-item-comment-name">{{ comment.userName }}：</span>
            <span class="dynamic-item-comment-content">{{ comment.commentContent }}</span>
          </div>
        </div>
        <!--点击弹出输入评论区域-->
        <div class="dynamic-item-input" @click="showComment(item.dynamicId, index)">
          <input disabled="disabled" placeholder="请输入评论"/>
        </div>
        <!--底部横线-->
        <div class="dynamic-item-line"></div>
      </div>
      <!--查看更多按钮-->
      <div class="dynamic-content-button" v-if="currentPage < pageTotal">
        <button type="button" @click="seeMore">查看更多</button>
      </div>
      <div class="dynamic-content-nodata" v-else>
        没有更多数据了~
      </div>
    </div>
    <!--发布动态按钮-->
    <div class="dynamic-add-button" @click="toDynamicAdd">+</div>
    <!--输入评论区域-->
    <div class="modal" v-if="showModal">
      <div class="modal-other" @click="showComment"></div>
      <div class="modal-content">
        <div class="modal-textarea">
          <textarea rows="3" placeholder="请输入评论内容" v-model="commentContent"></textarea>
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
  name: 'Dynamic',
  data () {
    return {
      // 当前页
      currentPage: 1,
      // 页大小
      pageSize: 1,
      // 总页数
      pageTotal: 0,
      // 用户ID
      userId: window.sessionStorage.getItem('userId'),
      // 用户类型
      userType: window.sessionStorage.getItem('userType'),
      // 动态集合
      dynamics: [],
      // 用户姓名
      userName: window.sessionStorage.getItem('userName'),
      // 显示评论模态框
      showModal: false,
      // 输入的评论内容
      commentContent: '',
      // 点击评论选中的动态ID
      dynamicId: null,
      // 当前索引
      currentIndex: null
    }
  },
  methods: {
    // 跳转到评论页面
    toDynamicAdd () {
      this.$router.push({ path: '/dynamic/add' })
    },
    // 加载动态内容数据
    loadDynamics () {
      // 使用axios的get请求后端，参数为：currentPage（当前页），pageSize（页大小）、userId（用户ID）、userType（用户类型）
      this.$axios.get('/businessDynamic/pageDynamics', {
        params: {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          userId: this.userId,
          userType: this.userType
        }
      }).then(res => {
        console.log(res)
        // 获取请求返回的数据
        const data = res.data.object
        // 判断查询出来的数据是否为空
        if (data.dynamics && data.dynamics.length > 0) {
          // 令查询出来的数据赋值给this.dynamics这个数组
          this.dynamics = this.dynamics.concat(data.dynamics)
          // 令查询出来的总页数赋值给this.pageTotal这个变量
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
    seeMore () {
      // 令当前页加一
      this.currentPage++
      // 执行请求后端查询视频方法
      this.loadDynamics()
    },
    showComment (dynamicId, index) {
      this.dynamicId = dynamicId
      this.currentIndex = index
      this.showModal = !this.showModal
    },
    // 新增评论
    addComment () {
      // 判断输入的评论内容是否为空
      if (!this.commentContent) {
        alert('请输入评论内容')
        return
      }
      // 使用axios的post请求后端数据
      this.$axios.post('/businessDynamicComment/addDynamicComment', {
        dynamicId: this.dynamicId,
        userId: this.userId,
        userType: this.userType,
        commentContent: this.commentContent
      }).then(res => {
        console.log(res)
        // 令查询出来的数据赋值给data
        const data = res.data
        if (data.success) {
          alert('评论成功！')
          // 令是否显示模态框等于是否显示模态框取反
          this.showModal = !this.showModal
          // 定义评论对象
          const obj = {
            userName: this.userName,
            commentContent: this.commentContent
          }
          // 将评论对象设置到评论数组里面
          this.dynamics[this.currentIndex].businessDynamicCommentVOs.push(obj)
          // 评论数加1
          this.dynamics[this.currentIndex].commentNumber += 1
          // 清空输入的文本
          this.commentContent = ''
        } else {
          alert('评论失败！')
        }
      })
    },
    // 点赞方法
    addOrDeleteDynamic (dynamicId, index) {
      // 使用axios的post请求后端数据
      this.$axios.post('/businessDynamicLike/addDeleteLike', {
        dynamicId: dynamicId,
        userId: this.userId,
        userType: this.userType
      }).then(res => {
        console.log(res)
        // 令查询出来的数据赋值给data
        const data = res.data.object
        // 提示成功失败数据
        alert(data.message)
        // 判断当前用户是否点赞，如果已点赞
        if (this.dynamics[index].userLikeNumber > 0) {
          // userLikeNumber为0，点赞按钮为普通状态
          this.dynamics[index].userLikeNumber = 0
          // 点赞数减一
          this.dynamics[index].likeNumber -= 1
        } else {
          // userLikeNumber为1，点赞按钮为高亮状态
          this.dynamics[index].userLikeNumber = 1
          // 点赞数加一
          this.dynamics[index].likeNumber += 1
        }
      })
    }
  },
  mounted () {
    this.loadDynamics()
  }
}
</script>

<style>
.dynamic-content {
  padding: 15px;
}
.dynamic-item-head {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.dynamic-item-title {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ff4242;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: bold;
}
.dynamic-item-name {
  font-size: 16px;
  font-weight: bold;
}
.dynamic-item-time {
  font-size: 14px;
}
.dynamic-item-content {
  font-size: 14px;
  margin-top: 5px;
}
.dynamic-item-img {
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  /*justify-content: space-between;*/
  flex-wrap: wrap;
}
.dynamic-item-img img {
  width: 32%;
  height: 80px;
  object-fit: cover;
  margin-bottom: 6px;
  margin-left: 2px;
  margin-right: 2px;
}
.dynamic-item-footer {
  text-align: right;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
}
.dynamic-item-line {
  margin: 15px 0;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.05);
}
.dynamic-item-comment-content {
  font-size: 14px;
}
.dynamic-item-comment-name {
  font-size: 14px;
  font-weight: bold;
  color: #FF4242;
}
.dynamic-item-input {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.dynamic-item-input input {
  width: 90%;
  height: 35px;
  border: none;
  border-radius: 15px;
  padding: 0 15px;
}
.dynamic-content-button button {
  width: 100%;
  height: 38px;
  border: 1px solid #FF5555;
  background: #FFFFFF;
  color: #FF5555;
  font-size: 14px;
  font-weight: bold;
  border-radius: 8px;
}
.dynamic-content-nodata {
  text-align: center;
  margin-bottom: 20px;
}
.dynamic-add-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #FF4242;
  color: #FFFFFF;
  font-size: 30px;
  font-weight: bold;
  position: fixed;
  bottom: 70px;
  right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
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
