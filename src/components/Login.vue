<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
          placeholder="请输入用户名"
          prefix-icon="iconfont icon-user"
          v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
          placeholder="请输入密码"
          prefix-icon="iconfont icon-3702mima"
          type="password"
          v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      // 表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败')
        } else {
          return this.$message.success('登录成功')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  height: 100%;
  background-color: #2b4b6b;
  .login_box{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 450px;
    height: 300px;
    border-radius: 8px;
    background-color: #fff;
    .avatar_box{
      overflow: hidden;
      margin: -50px auto 0 auto;
      padding: 10px;
      width: 100px;
      height: 100px;
      border: 1px solid #ccc;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
      img{
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form{
      position: absolute;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      bottom: 0;
      .btns{
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
