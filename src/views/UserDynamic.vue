<template>
  <div>
    <!--头部红色区域-->
    <div class="header">{{ dynamicType }}</div>
    <!--左边返回按钮-->
    <div class="return" @click="toPersonal">&lt;</div>
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
          <span :style="item.userLikeNumber > 0 ? { color: '#ff4242' } : {}" class="iconfont icon-dianzan" style="font-size: 18px;"></span>&nbsp;
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
        <div class="dynamic-item-input">
          <input disabled="disabled" placeholder="请输入评论"/>
        </div>
        <!--底部横线-->
        <div class="dynamic-item-line"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserDynamic',
  data () {
    return {
      // 类型【0：我点赞过的动态，1：我评论过的动态，2：我发布的动态】
      type: Number(this.$route.query.type),
      // 用户姓名
      userId: window.sessionStorage.getItem('userId'),
      // 用户类型
      userType: window.sessionStorage.getItem('userType'),
      // 动态集合
      dynamics: []
    }
  },
  methods: {
    // 点击返回按钮触发事件
    toPersonal () {
      // 点击跳转到光大之友
      this.$router.push({ path: '/personal' })
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
    // 查询我点赞/评论/发布的动态列表
    listDynamicsByUserId () {
      let url = ''
      // 判断是否为我点赞的动态
      if (this.type === 0) {
        url = '/businessDynamic/listDynamicByUserId'
      } else if (this.type === 1) {
        // 判断是否为我评论的动态
        url = '/businessDynamic/listDynamicByLikeUserId'
      } else if (this.type === 2) {
        // 判断是否为我发布的动态
        url = '/businessDynamic/listDynamicByCommentUserId'
      }
      this.$axios.get(url, {
        params: {
          userId: this.userId,
          userType: this.userType
        }
      }).then(res => {
        console.log(res)
        this.dynamics = res.data.object
      })
    }
  },
  mounted () {
    this.listDynamicsByUserId()
  },
  computed: {
    dynamicType () {
      if (this.type === 0) {
        return '我点赞的动态'
      } else if (this.type === 1) {
        return '我评论的动态'
      } else {
        return '我发布的动态'
      }
    }
  }
}
</script>

<style scoped="scoped">
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
</style>
