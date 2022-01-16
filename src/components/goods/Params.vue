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

      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="tabsClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="small"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >
            添加参数
          </el-button>
          <!-- 表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="(tag, i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="true"
                  @close="handleClose(i, scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <!-- 文本输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加tag按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="small"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >
            添加属性
          </el-button>
          <!-- 表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="(tag, i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="true"
                  @close="handleClose(i, scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <!-- 文本输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加tag按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <span>
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addForm"
          label-width="100px"
        >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input> </el-form-item
        ></el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="'编辑' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <span>
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editForm"
          label-width="100px"
        >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input> </el-form-item
        ></el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
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
      selectedKeys: [],
      // 页签选中值
      activeName: 'many',
      // 动态参数
      manyTableData: [],
      // 静态属性
      onlyTableData: [],
      // 添加参数对话框可见性
      addDialogVisible: false,
      // 编辑参数对话框可见性
      editDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {},
      // 编辑参数的表单数据对象
      editForm: {},
      // 添加表单的验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 编辑表单的验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // tag输入框的可见性
      inputVisible: false,
      // tag输入框绑定值
      inputValue: ''
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
      this.getParamsData()
    },
    // tab页签点击切换触发
    tabsClick () {
      this.getParamsData()
    },
    // 获取参数列表数据
    async getParamsData () {
      // 如果选中的不是三级分类
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 选中的为三级分类
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      )
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals !== '' ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败!')
      }
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else if (this.activeName === 'only') {
        this.onlyTableData = res.data
      }
    },
    // 添加参数对话框关闭事件
    addDialogClosed () {
      this.$refs.addForm.resetFields()
    },
    // 编辑参数对话框关闭事件
    editDialogClosed () {
      this.$refs.editForm.resetFields()
    },
    // 点击按钮，添加参数
    addParams () {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败!')
        }
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    // 展示编辑表单
    async showEditDialog (attrId) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attrId}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败!')
      }
      this.editForm = res.data
    },
    // 点击按钮，编辑参数
    editParams () {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.editForm.attr_sel
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败!')
        }
        this.$message.success('修改参数成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 删除参数操作
    async deleteParams (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(() => {
        this.$message.info('已取消删除!')
      })
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(
          `categories/${this.cateId}/attributes/${id}`
        )
        if (res.meta.status !== 200) {
          return this.$message.error('删除参数失败!')
        }
        this.$message.success('删除参数成功')
        this.getParamsData()
      }
    },
    // tag输入框失去焦点或回车触发
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果输入了非空字符串，则进行后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      this.saveAttrVals(row)
    },
    // 点击添加tag按钮触发
    showInput (row) {
      row.inputVisible = true
      // 当页面元素被重新渲染之后再调用回调函数
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 移除tag标签触发
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      // 发起提交编辑请求
      this.saveAttrVals(row)
    },
    // 将当前tag标签数据提交保存
    async saveAttrVals (row) {
      // 发起提交参数请求
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败!')
      }
      this.$message.success('修改参数项成功')
    }
  },
  computed: {
    isBtnDisabled () {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId () {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opts {
  margin: 20px 0;
}
.el-cascader {
  width: 250px;
}
.el-card {
  margin-bottom: 60px;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 90px;
}
</style>
