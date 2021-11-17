<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="openAddRoleDialog">添加角色</el-button>
      <el-table :data="rolesList" stripe border>
        <el-table-column width="60px" type="expand">
          <template v-slot="{ row }">
            <el-row
              v-for="(firstRight, i1) in row.children"
              :key="firstRight.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="4">
                <el-tag closable @close="removeRightByID(row, firstRight.id)">{{
                  firstRight.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二三级权限 -->
              <el-col :span="20">
                <el-row
                  v-for="(secondRight, i2) in firstRight.children"
                  :key="secondRight.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightByID(row, secondRight.id)"
                      type="success"
                      >{{ secondRight.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="thirdRight in secondRight.children"
                      :key="thirdRight.id"
                      closable
                      @close="removeRightByID(row, thirdRight.id)"
                      >{{ thirdRight.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="{ row }">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoleById(row.id)"
              >编辑</el-button
            >
            <!--删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
            @click="deleteRole(row.id)"
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
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="closeEditRoleDialog"
    >
       <span>
        <el-form
          :model="editRoleForm"
          status-icon
          :rules="RoleFormRule"
          ref="editRoleFormRef"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input
              v-model="editRoleForm.roleName"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input
              v-model="editRoleForm.roleDesc"
            ></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="closeAddRoleDialog"
    >
       <span>
        <el-form
          :model="addRoleForm"
          status-icon
          :rules="RoleFormRule"
          ref="addRoleFormRef"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input
              v-model="addRoleForm.roleName"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input
              v-model="addRoleForm.roleDesc"
            ></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      rolesList: [],
      addDialogVisible: false,
      // 添加角色对话框可见性
      addRoleDialogVisible: false,
      editRoleForm: {},
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      RoleFormRule: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 15,
            message: '长度在 2 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    // 通过ID移除指定权限
    async removeRightByID (role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        this.$message.info('取消了删除操作')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')
      role.children = res.data
    },
    // 编辑角色
    async editRoleById (roleId) {
      this.addDialogVisible = true
      const { data: res } = await this.$http.get('roles/' + roleId)
      console.log(res)
      this.editRoleForm = res.data
    },
    // 关闭对话框回调
    closeEditRoleDialog () {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 修改角色
    editRole () {
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editRoleForm.roleId, {
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色失败')
        }
        this.$message.success('修改角色成功')
        // 重新获取角色列表
        this.getRolesList()
        this.addDialogVisible = false
      })
    },
    // 删除角色
    async deleteRole (roleId) {
      const { data: res } = await this.$http.delete('roles/' + roleId)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.getRolesList()
    },
    openAddRoleDialog () {
      this.addRoleDialogVisible = true
    },
    closeAddRoleDialog () {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 添加角色
    addRole () {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', {
          roleName: this.addRoleForm.roleName,
          roleDesc: this.addRoleForm.roleDesc
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        this.addRoleDialogVisible = false
        this.getRolesList()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-bottom: 100px;
}
.el-row {
  padding: 0 40px;
}
.el-tag {
  margin: 10px 6px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
