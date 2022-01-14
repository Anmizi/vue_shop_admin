<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: lightgreen"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag
            type="warning"
            size="mini"
            v-else-if="scope.row.cat_level === 2"
            >三级</el-tag
          >
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      @closed="addCateDialogClosed"
      width="50%"
    >
      <span>
        <el-form
          :model="addCateForm"
          :rules="addCateRules"
          ref="addCateForm"
          label-width="100px"
        >
          <el-form-item label="分类名称: " prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类: ">
               <!-- options指定数据源 -->
            <el-cascader
              v-model="selectedKeys"
              :options="parentsCateList"
              :props="cascadeProps"
              @change="parentsCateChanged"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表
      catelist: [],
      // 总数据条数
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 默认添加一级分类
        cat_level: 0
      },
      // 表单验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentsCateList: [],
      // 指定级联选择器配置对象
      cascadeProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的id数组
      selectedKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('商品分类获取失败!')
      }
      console.log(res.data)
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 当前页更改触发
    handleCurrentChange (currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getCateList()
    },
    // 每页显示条数更改时触发
    handleSizeChange (currentPageSize) {
      this.queryInfo.pagesize = currentPageSize
      this.getCateList()
    },
    // 添加分类按钮点击事件
    addCate () {
      this.getParentsList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类数据列表
    async getParentsList () {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类列表失败!')
      }
      this.parentsCateList = res.data
      console.log(res.data)
    },
    // 选择项发生变化时触发
    parentsCateChanged () {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类表单确认事件
    addCateConfirm () {
      console.log(this.addCateForm)
    },
    // 监听点击分类表单关闭事件
    addCateDialogClosed () {
      this.$refs.addCateForm.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  padding-bottom: 20px;
}
.el-card {
  margin-bottom: 100px;
}
.el-cascader{
  width: 100%;
}
</style>
