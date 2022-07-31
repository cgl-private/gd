<template>
  <div class="login">
    <div class="header">身份认证</div>
    <ul class="header-tabs">
      <li class="header-tabs-item" v-for="(item, index) in tabsData" :key="index" :class="{ 'header-tabs-item-active' : index == currentIndex }"
      @click="toggleTabs(index)">{{item}}</li>
    </ul>
    <div v-if="currentIndex == 0" class="login-content">
      <div class="login-content-item">
        <div class="login-content-item-label">学生姓名：</div>
        <div class="login-content-item-input">
          <input v-model="studentForm.studentName" type="text" placeholder="请输入学生姓名" @keyup.enter="selectStudent"/>
        </div>
      </div>
      <div class="login-content-line"></div>
      <div class="login-content-item">
        <div class="login-content-item-label">手机号码：</div>
        <div class="login-content-item-input">
          <input v-model="studentForm.studentPhone" type="text" placeholder="请输入手机号码" @keyup.enter="selectStudent"/>
        </div>
      </div>
      <div class="login-content-line"></div>
      <div class="login-content-item">
        <div class="login-content-item-label">入学年级：</div>
        <div class="login-content-item-input">
          <select v-model="studentForm.gradeId" >
            <option value="">请选择入学年级</option>
            <option v-for="(item, index) in grades" :key="index" :value="item.gradeId">{{item.gradeName}}</option>
          </select>
        </div>
      </div>
      <div class="login-content-line"></div>
      <div class="login-content-save">
        <button type="button" @click="selectStudent">认&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;证</button>
      </div>
    </div>
    <div v-if="currentIndex == 1" class="login-content">
      <div class="login-content-item">
        <div class="login-content-item-label">教师姓名：</div>
        <div class="login-content-item-input">
          <input v-model="teacherForm.teacherName" type="text" placeholder="请输入教师姓名" @keyup.enter="selectTeacher"/>
        </div>
      </div>
      <div class="login-content-line"></div>
      <div class="login-content-item">
        <div class="login-content-item-label">手机号码：</div>
        <div class="login-content-item-input">
          <input v-model="teacherForm.teacherPhone" type="text" placeholder="请输入手机号码" @keyup.enter="selectTeacher"/>
        </div>
      </div>
      <div class="login-content-line"></div>
      <div class="login-content-item">
        <div class="login-content-item-label">所属学科：</div>
        <div class="login-content-item-input">
          <select v-model="teacherForm.subjectId" @keyup.enter="selectTeacher">
            <option value="">请选择所属学科</option>
            <option v-for="(item, index) in subjects" :key="index" :value="item.subjectId">{{item.subjectName}}</option>
          </select>
        </div>
      </div>
      <div class="login-content-line"></div>
      <div class="login-content-save">
        <button type="button" @click="selectTeacher">认&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;证</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      // tabs选项数据
      tabsData: ['学生', '教师'],
      // 当前选中tab索引
      currentIndex: 0,
      // 年级信息集合，用于绑定入学年级下拉框
      grades: [],
      // 学科信息集合，用于绑定所属学科下拉框
      subjects: [],
      // 学生信息表单，用于认证学生，作为参数传输给后端
      studentForm: {
        studentName: '',
        studentPhone: '',
        gradeId: ''
      },
      teacherForm: {
        teacherName: '',
        teacherPhone: '',
        subjectId: ''
      }
    }
  },
  methods: {
    // 头部tab栏点击事件
    toggleTabs (index) {
      // 令当前索引等于点击的索引
      this.currentIndex = index
    },
    // 查询入学年级下拉框数据
    initGrades () {
      this.$axios.get('/baseGrade/listGrades').then(res => {
        this.grades = res.data.object
      })
    },
    // 查询所属学科下拉框数据
    initSubjects () {
      this.$axios.get('/baseSubject/listSubjects').then(res => {
        this.subjects = res.data.object
      })
    },
    // 点击学生tab栏的认证按钮触发事件
    selectStudent () {
      // 判断学生姓名是否为空
      if (!this.studentForm.studentName) {
        alert('请输入学生姓名')
        return
      }
      if (!this.studentForm.studentPhone) {
        alert('请输入手机号码')
        return
      }
      if (!this.studentForm.gradeId) {
        alert('请输入入学年级')
        return
      }
      this.$axios.get('/baseStudent/getStudentByNameAndPhoneAndGradeId', {
        params: this.studentForm
      }).then(res => {
        console.log(res)
        // 判断查出来的数据是否为空
        if (res.data.object) {
          // 如果不为空则提示，认证成功
          alert('认证成功！')
          window.sessionStorage.setItem('isLogin', true)
          // 把用户类型保存到sessionStorage
          window.sessionStorage.setItem('userType', 'student')
          // 把用户ID保存到sessionStorage
          window.sessionStorage.setItem('userId', res.data.object.studentId)
          // 把用户名保存到sessionStorage
          window.sessionStorage.setItem('userName', res.data.object.studentName)
          window.sessionStorage.setItem('userPhone', res.data.object.studentPhone)
          this.$router.push({ path: '/home' })
        } else {
          // 否则认证失败
          alert('认证失败！')
        }
      })
    },
    // 点击教师tab栏的认证按钮触发时间
    selectTeacher () {
      // 判断教师姓名是否为空
      if (!this.teacherForm.teacherName) {
        alert('请输入教师姓名')
        return
      }
      if (!this.teacherForm.teacherPhone) {
        alert('请输入手机号码')
        return
      }
      if (!this.teacherForm.subjectId) {
        alert('请输入所属科目')
        return
      }
      this.$axios.get('/baseTeacher/getTeacherByNameAndPhoneAndSubjectId', {
        params: this.teacherForm
      }).then(res => {
        console.log(res)
        // 判断查出来的数据是否为空
        if (res.data.object) {
          // 如果不为空则提示，认证成功
          alert('认证成功！')
          // 把用户类型保存到sessionStorage
          window.sessionStorage.setItem('userType', 'teacher')
          // 把用户ID保存到sessionStorage
          window.sessionStorage.setItem('userId', res.data.object.teacherId)
          // 把用户名保存到sessionStorage
          window.sessionStorage.setItem('userName', res.data.object.teacherName)
          window.sessionStorage.setItem('userPhone', res.data.object.teacherPhone)
          this.$router.push({ path: '/home' })
        } else {
          // 否则认证失败
          alert('认证失败！')
        }
      })
    }
  },
  // 组件加载完成时触发的钩子函数
  mounted () {
    // 调用查询入学年级下拉框数据的方法
    this.initGrades()
    // 调用查询所属学科下拉框数据的方法
    this.initSubjects()
  }
}
</script>

<style>
  .header {
    height: 44px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    background-image: linear-gradient(-90deg, #ff4242 0%, #ff6451 100%);
  }
  .header-tabs {
    height: 40px;
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    padding: 0;
    margin: 0;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  .header-tabs-item {
    font-size: 14px;
    color: black;
    line-height: 40px;
    white-space: nowrap;
    text-align: center;
    width: 50%;
    display: inline-block;
  }
  .header-tabs-item-active {
    color: #ff5555;
    font-weight: bold;
  }
  .login-content {
    padding: 15px 20px;
  }
  .login-content-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .login-content-item-label {
    width: 80px;
    font-size: 14px;
  }
  .login-content-item-input {
    width: calc(100% - 80px);
  }
  .login-content-item-input input {
    width: 100%;
    border: none;
    background: transparent;
    height: 24px;
  }
  .login-content-line {
    margin: 10px 0 15px 0;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.05);
  }
  .login-content-item-input select {
    width: 100%;
    border: none;
    appearance: none;
    background: transparent;
    height: 24px;
  }
  .login-content-save button {
    width: 100%;
    height: 38px;
    border: none;
    background: #FF5555;
    color: #FFFFFF;
    font-size: 14px;
    font-weight: bold;
    border-radius: 8px;
  }
</style>
