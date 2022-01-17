<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList()">
            <el-button slot="append" icon="el-icon-search"  @click="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表数据表格 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100">
        </el-table-column>
        <el-table-column
          prop="goods_number"
          label="商品数量"
          width="100"
        ></el-table-column>
        <el-table-column label="创建时间" width="100">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button size="mini" type="primary">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteGoods(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'List',
  data () {
    return {
      goodsList: [],
      queryInfo: {
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10,
        // 查询商品参数
        query: ''
      },
      // 商品列表总数
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败!')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 每页条数改变时触发
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 当前页改变时触发
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 查询商品列表
    searchGoods () {
      this.getGoodsList()
    },
    // 点击添加商品按钮触发
    addGoods () {

    },
    // 删除商品信息
    async deleteGoods (goodsId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(`goods/${goodsId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除商品失败!')
        }
        this.$message.success('删除商品成功')
        this.getGoodsList()
      } else {
        this.$message.info('已取消删除')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-bottom: 60px;
}
</style>
