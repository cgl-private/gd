<template>
  <div class="dynamic-add">
    <!--头部区域-->
    <div class="dynamic-add-header">
      <div class="header">添加动态</div>
      <!--左边返回按钮-->
      <div class="return" @click="toDynamic">&lt;</div>
    </div>
    <!--输入动态区域-->
    <div class="dynamic-add-cotent">
      <!--输入动态内容区域-->
      <div class="dynamic-add-textarea">
        <textarea v-model="dynamicContent" rows="3" placeholder="请输入动态内容"></textarea>
      </div>
      <!--选择动态发布图片区域-->
      <div class="select-image">
        <button type="button" @click="clickSelectImage">选择图片</button>
        <!--accept：只能选择图片，multiple：可多选，hidden：隐藏选择文件框-->
        <input type="file" ref="selectImage" accept="image/*" multiple hidden @change="filePreview"/>
      </div>
    </div>
    <!--显示选中的图片区域-->
    <div class="dynamic-add-img">
      <img v-for="(item, index) in selectImage" :key="index" :src="item"/>
    </div>
    <!--发布动态按钮-->
    <div class="publish-button">
      <button type="button" @click="saveDynamic">发布</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DynamicAdd',
  data () {
    return {
      dynamicContent: '',
      // 选择的图片（用于显示）
      selectImage: [],
      // 选择的文件（用于提交数据）
      selectFiles: []
    }
  },
  methods: {
    toDynamic () {
      this.$router.push({ path: '/dynamic' })
    },
    // 点击选择图片按钮触发事件
    clickSelectImage () {
      // 模拟点击selectImage的input文件选择框
      this.$refs.selectImage.click()
    },
    // 预览图片
    filePreview (e) {
      // 获取选择的文件
      var files = e.target.files
      // 判断是否支持FileReader
      if (!e || !window.FileReader) return
      // 遍历选中的文件列表
      for (let i = 0; i < files.length; i++) {
        // 实例化文件读取器
        const reader = new FileReader()
        // 把遍历出来的文件设置到文件读取器里面
        // 文件转换
        reader.readAsDataURL(files[i])
        // 文件读取器加载完成返回加载的图片数据（base64）
        reader.onloadend = (res) => {
          this.selectImage.push(res.currentTarget.result)
          this.selectFiles.push(files[i])
        }
      }
    },
    // 发布动态按钮
    saveDynamic () {
      // 判断输入的内容是否为空
      if (!this.dynamicContent) {
        alert('请输入动态内容')
        return
      }
      // 获取sessionStorage里面的userId
      const userId = window.sessionStorage.getItem('userId')
      // 获取sessionStorage里面的userType
      const userType = window.sessionStorage.getItem('userType')
      // 实例化一个FormData对象
      const formData = new FormData()
      // 遍历选择的文件添加进formData
      for (let i = 0; i < this.selectFiles.length; i++) {
        formData.append('files', this.selectFiles[i])
      }
      // 把userId的值设置进dormData
      formData.append('userId', userId)
      // 把userType的值设置进dormData
      formData.append('userType', userType)
      // 把dynamicContent的设置进formData
      formData.append('dynamicContent', this.dynamicContent)
      // 配置请求头允许文件上传
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      // 使用axios的post请求给后端发送数据
      this.$axios.post('/businessDynamic/insertDynamic', formData, config).then(res => {
        if (res.data.success) {
          // 提示保存成功
          alert('保存成功')
          // 返回列表
          this.toDynamic()
        } else {
          // 提示保存失败
          alert('保存失败')
        }
      })
    }
  },
  mounted () {}
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
.return {
  position: absolute;
  top: 0;
  left: 10px;
  color: #FFFFFF;
  font-size: 20px;
  line-height: 44px;
}
.dynamic-add-cotent {
  padding: 15px;
}
.dynamic-add-textarea {
  display: flex;
  justify-content: center;
}
.dynamic-add-textarea textarea {
  height: 140px;
  width: 100%;
  border: none;
}
.select-image {
  margin-top: 15px;
}
.select-image button {
  width: 100%;
  height: 38px;
  border: 1px solid #FF5555;
  background: #FFFFFF;
  color: #FF5555;
  font-size: 14px;
  font-weight: bold;
  border-radius: 8px;
}
.dynamic-add-img {
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  margin-left: 2px;
  margin-right: 2px;
  /*justify-content: space-between;*/
  flex-wrap: wrap;
  padding: 10px;
}
.dynamic-add-img img {
  width: 32%;
  object-fit: cover;
  margin-bottom: 6px;
  margin-left: 2px;
  margin-right: 2px;
}
.publish-button {
  margin: 15px;
}
.publish-button button {
  width: 100%;
  height: 38px;
  border: 1px solid #FF5555;
  background: #FF5555;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: bold;
  border-radius: 8px;
}
</style>
