<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意: 只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opts">
        <el-col>
          <span>选择商品分类: </span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="changeSelectedKeys"
          ></el-cascader>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      // 分类列表数据
      cateList: [],
      // 级联选择器配置
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联级默认选项值
      selectedKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 3
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败!')
      }
      // console.log(res.data)
      this.cateList = res.data
    },
    // 级联选择器选中节点变化触发事件
    changeSelectedKeys () {
      console.log(this.selectedKeys)
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opts{
  margin-top: 20px;
}
</style>
