<template>
  <el-container class="home-container">
  <el-header>
    <div class="home-logo">
      <img src="../assets/home-logo.png" alt="">
    </div>
    <el-button type="info" class="logout-btn">退出登录</el-button>
  </el-header>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
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
.home-container{
  height: 100%;
  .el-header{
    padding-left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .home-logo{
      height: 100%;
      img{
        height: 100%;
      }
    }
    }
    background: #eeeeee;
  .el-aside{
    background: #304156;
  }
}

</style>
