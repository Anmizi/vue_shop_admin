<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏切换区域 -->
      <el-tabs  v-model="activeIndex" tab-position="left" style="height: 200px" @tab-click="tabClick">
        <el-tab-pane label="基本信息">用户管理</el-tab-pane>
        <el-tab-pane label="商品参数">配置管理</el-tab-pane>
        <el-tab-pane label="商品属性">角色管理</el-tab-pane>
        <el-tab-pane label="商品图片">定时任务补偿</el-tab-pane>
         <el-tab-pane label="商品内容">定时任务补偿</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AddGoods',
  data () {
    return {
      activeIndex: '0'
    }
  },
  methods: {
    tabClick () {

    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
/deep/ .el-step__title {
  font-size: 14px;
}
</style>
