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
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          @tab-click="tabClick"
          :before-leave="beforeTabLeave"
        >
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cascaderProps"
                @change="changeSelectedKeys"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableList"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="name"
                  v-for="(name, i) in item.attr_vals"
                  :key="i"
                  border
                  size="small"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableList"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headersObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'AddGoods',
  data () {
    return {
      activeIndex: '0',
      // 添加商品表单数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        // 上传图片的临时路径数组
        pics: [],
        // 商品介绍信息
        goods_introduce: '',
        // 商品参数数组
        attrs: []
      },
      // 添加商品表单验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类数据列表
      catelist: [],
      // 级联选择器配置
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数列表数据
      manyTableList: [],
      // 静态属性列表数据
      onlyTableList: [],
      // 商品参数值数组
      checkList: [],
      // 上传图片的URL地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览路径
      previewPath: '',
      // 图片预览框可见性
      previewVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败!')
      }
      this.catelist = res.data
      // console.log(this.catelist)
    },
    // 级联选择器选中项改变触发
    changeSelectedKeys () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // tabs标签页切换
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类!')
        return false
      }
    },
    // 切换tabs标签栏触发
    async tabClick () {
      // 当点击的是商品参数标签时
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateid}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败!')
        }
        // console.log(res.data)
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals === '' ? [] : item.attr_vals.split(' ')
        })

        this.manyTableList = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateid}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态参数列表失败!')
        }
        console.log(res.data)
        this.onlyTableList = res.data
      }
    },
    // 点击已经上传图片的钩子
    handlePreview (file) {
      this.previewPath = file.response.data.url
      console.log(this.previewPath)
      // 点击预览，显示预览框
      this.previewVisible = true
    },
    // 文件列表移除文件时的钩子
    handleRemove (file) {
      const picInfo = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex((x) => x.pic === picInfo)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 图片上传成功时的钩子
    handleSuccess (response) {
      console.log(response)
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 点击添加商品触发
    async add () {
      // 触发表单预验证
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请求填写表单必要项!')
        }
      })
      // 发起请求提交表单
      const addForm = _.cloneDeep(this.addForm)
      addForm.goods_cat = this.addForm.goods_cat.join(',')
      // 处理动态参数
      this.manyTableList.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_values: item.attr_vals.join(' ')
        }
        addForm.attrs.push(newInfo)
      })
      // 处理静态属性
      this.onlyTableList.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_values: item.attr_vals
        }
        addForm.attrs.push(newInfo)
      })
      // console.log(addForm)
      // 发起请求添加商品
      const { data: res } = await this.$http.post('goods', addForm)
      if (res.meta.status !== 201) {
        this.$message.error('商品添加失败!')
      }
      this.$message.success('商品添加成功!')
      this.$router.push('/goods')
    }
  },
  computed: {
    cateid () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
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
/deep/ .el-checkbox {
  margin: 0;
}
.el-card {
  margin-bottom: 60px;
}
.el-dialog .previewImg {
  width: 100%;
}
.addBtn{
  margin: 20px 0;
}
</style>
