<template>
  <div class="personal">
    <!--头部区域-->
    <div class="header">光大之友</div>
    <!--内容区域-->
    <div class="personal-info">
      <div class="personal-info-head">
        <!-- 个人头像：取姓名的第一位作为头像 -->
        <div class="personal-info-title">
          {{ userName.substring(0, 1) }}
        </div>
        <!-- 个人姓名和手机号码 -->
        <div class="personal-info-right">
          <div class="personal-info-name">&nbsp;&nbsp;&nbsp;{{ userName }}</div>
          <div class="personal-info-phone">&nbsp;&nbsp;&nbsp;{{ userPhone }}</div>
        </div>
      </div>
    </div>
    <!--个人菜单区域-->
    <div class="personal-menu">
      <!--我点赞的新闻-->
      <div class="personal-line"></div>
      <div class="personal-menu-item" @click="toUserNew(0)">
        <div class="menu-item-title">我点赞的新闻</div>
        <div class="menu-item-right">></div>
      </div>
      <!--我评论的新闻-->
      <div class="personal-line"></div>
      <div class="personal-menu-item" @click="toUserNew(1)">
        <div class="menu-item-title">我评论的新闻</div>
        <div class="menu-item-right">></div>
      </div>
      <!--我点赞的视频-->
      <div class="personal-line"></div>
      <div class="personal-menu-item" @click="toUserVideo(0)">
        <div class="menu-item-title">我点赞的视频</div>
        <div class="menu-item-right">></div>
      </div>
      <!--我评论的视频-->
      <div class="personal-line"></div>
      <div class="personal-menu-item" @click="toUserVideo(1)">
        <div class="menu-item-title">我评论的视频</div>
        <div class="menu-item-right">></div>
      </div>
      <!--我发布的动态-->
      <div class="personal-line"></div>
      <div class="personal-menu-item" @click="toUserDynamic(2)">
        <div class="menu-item-title">我发布的动态</div>
        <div class="menu-item-right">></div>
      </div>
      <!--我点赞的动态-->
      <div class="personal-line"></div>
      <div class="personal-menu-item" @click="toUserDynamic(0)">
        <div class="menu-item-title">我点赞的动态</div>
        <div class="menu-item-right">></div>
      </div>
      <!--我评论的动态-->
      <div class="personal-line"></div>
      <div class="personal-menu-item" @click="toUserDynamic(1)">
        <div class="menu-item-title">我评论的动态</div>
        <div class="menu-item-right">></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Personal',
  data () {
    return {
      // 用户姓名
      userName: window.sessionStorage.getItem('userName'),
      // 用户手机号码
      userPhone: window.sessionStorage.getItem('userPhone')
    }
  },
  methods: {
    toUserNew (type) {
      this.$router.push({ path: '/user/new', query: { type: type } })
    },
    toUserVideo (type) {
      this.$router.push({ path: '/user/video', query: { type: type } })
    },
    toUserDynamic (type) {
      this.$router.push({ path: '/user/dynamic', query: { type: type } })
    }
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
  .personal-info {
    padding: 15px;
  }
  .personal-info-head {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .personal-info-title {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #ff4242;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    font-size: 18px;
    font-weight: bold;
  }
  .personal-info-name {
    font-size: 16px;
    font-weight: bold;
  }
  .personal-info-phone {
    font-size: 14px;
    margin-top: 10px;
  }
  .personal-menu {
    margin-top: 10px;
  }
  .personal-line {
    height: 1px;
    background-color: rgba(0, 0, 0, 0.05);
  }
  .personal-menu-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 11px 15px;
  }
  .menu-item-title {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.8);
  }
  .menu-item-right {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.6);
  }
</style>
