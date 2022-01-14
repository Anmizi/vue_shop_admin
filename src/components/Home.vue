<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div class="home-logo">
        <img src="../assets/home-logo.png" alt="" />
      </div>
      <span>Vue_shop后台管理系统</span>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? 'auto' : '200px'">
        <el-menu
          mode="vertical"
          router
          background-color="#304156"
          text-color="#fff"
          active-text-color="#409eff"
          :collapse-transition="false"
          :unique-opened="true"
          :collapse="isCollapse"
          :default-active="activePath"
        >
          <div class="toggleMenu" @click="toggleMenu">|||</div>
          <el-submenu
            :index="String(item.id)"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span slot="title">{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="'/' + subItem.path"
              @click="saveActivePath('/' + subItem.path)"
            >
              <i class="el-icon-menu"></i>
              <span slot="title">{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      // 是否折叠
      isCollapse: false,
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('/menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    // 切换折叠
    toggleMenu () {
      this.isCollapse = !this.isCollapse
    },
    // 侧边栏切换高亮效果
    saveActivePath (path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  overflow: hidden;
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
    span {
      font-size: 30px;
      font-style: bold;
      // color: #93c47d;
      color: #409eff;
    }
  }
  background: #eeeeee;
  .el-aside {
    .el-menu {
      overflow: hidden;
      height: 100%;
      .toggleMenu {
        text-align: center;
        color: #fff;
        cursor: pointer;
      }
    }
  }
  .el-main{
    height: 100vh;
  }
}
.iconfont {
  margin-right: 10px;
}
</style>
