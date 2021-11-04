<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div class="home-logo">
        <img src="../assets/home-logo.png" alt="" />
      </div>
      <span>Vue_shop后台管理系统</span>
      <el-button type="info" class="logout-btn">退出登录</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          background-color="#304156"
          text-color="#fff"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">用户管理</span>
            </template>
            <el-menu-item>
              <i class="el-icon-menu"></i>
              <span slot="title">选项一</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主区域 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
    padding-left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .home-logo {
      height: 100%;
      img {
        height: 100%;
      }
    }
    span{
      font-size: 30px;
      font-style: bold;
      color: #93c47d;
    }
  }
  background: #eeeeee;
  .el-aside {
    background: #304156;
  }
}
</style>
