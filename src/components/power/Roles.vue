<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table :data="rolesList" stripe border>
        <el-table-column width="60px" type="expand">
          <template v-slot="{ row }">
            <el-row v-for="(firstRight,i1) in row.children" :key="firstRight.id" :class="['bdbottom', i1 === 0 ? 'bdtop' : '']">
              <!-- 渲染一级权限 -->
              <el-col :span="4">
                <el-tag>{{firstRight.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二三级权限 -->
              <el-col :span="20">
                <el-row v-for="(secondRight,i2) in firstRight.children" :key="secondRight.id" :class="[i2 === 0 ? '' : 'bdtop']">
                  <el-col :span="6">
                    <el-tag type="success">{{secondRight.authName}}</el-tag>
                     <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(thirdRight) in secondRight.children" :key="thirdRight.id">{{thirdRight.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template>
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <!--删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <!-- 分配权限按钮 -->
            <el-tooltip
              class="item"
              effect="light"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"
                >分配权限</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      rolesList: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('/roles')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.$message.success('获取角色列表成功')
      this.rolesList = res.data
    }
  }
}
</script>
<style lang="less" scoped>
.el-card{
  margin-bottom: 100px;
}
.el-row{
  padding: 0 40px;
}
.el-tag{
  margin: 10px 6px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
</style>
