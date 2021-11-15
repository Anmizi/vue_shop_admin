<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" stripe border>
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="权限路径"> </el-table-column>
        <el-table-column prop="level" label="等级">
          <template v-slot="{row}">
           <el-tag v-if="row.level == 0">一级</el-tag>
           <el-tag v-else-if="row.level == 1" type="success">二级</el-tag>
           <el-tag v-else-if="row.level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('权限列表获取失败')
      }
      console.log(res.data)
      this.rightsList = res.data
      return this.$message.success('权限列表获取成功')
    }
  }
}
</script>

<style lang="less" scoped>
.el-card{
  height: 100%;
  margin-bottom: 100px;
}
</style>
