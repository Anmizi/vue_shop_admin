<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <!-- input输入框区域 -->
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderList" stripe style="width: 100%" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100">
        </el-table-column>
        <el-table-column label="是否付款" width="100">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.pay_status">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-s-tools"
              size="small"
            ></el-button>
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
  name: 'Order',
  data () {
    return {
      orderList: [],
      // 获取订单列表的请求参数
      queryInfo: {
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10
      },
      // 订单列表数据总数
      total: 0
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表数据
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败!')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(this.orderList)
    },
    // 每页条数改变时触发
    handleSizeChange (pageSize) {
      this.queryInfo.pagesize = pageSize
      this.getOrderList()
    },
    // 当前页改变时触发
    handleCurrentChange (currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getOrderList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-bottom: 100px;
}
</style>
