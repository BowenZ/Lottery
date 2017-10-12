<template>
  <div class="user-admin">
    <el-card class="box-card">
      <el-table :data="tableData" border style="width: 100%" v-loading="tableLoading">
        <el-table-column type="index" width="100"></el-table-column>
        <el-table-column prop="tel" label="手机号">
        </el-table-column>
        <el-table-column label="创建时间">
          <template scope="scope">
            {{formatDate(scope.row.createTime)}}
          </template>
        </el-table-column>
        <!-- <el-table-column
      label="中奖状态"
      width="100">
      <template scope="scope">
      	<el-tag v-if="scope.row.state == 0">未中奖</el-tag>
      	<el-tag v-if="scope.row.state == 1" type="primary">已中奖</el-tag>
      </template>
    </el-table-column> -->
        <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-button type="text" @click="deleteUser(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import util from '@/util/'
import userService from '@/service/userService'
export default {

  name: 'userAdmin',

  data() {
    return {
      tableData: [],
      tableLoading: true
    }
  },
  created() {
    userService.findAllUser().then(res => {
      this.tableLoading = false
      console.log('====user====', res)
      let result = res.data
      if (result.success) {
        this.tableData = result.data
      }
    }).catch(err => {
      this.tableLoading = false
    })
    userService.rigister().then(res=>{
    	console.log('====res====', res)
    })
  },
  methods: {
    formatDate(date) {
      return util.formatDate(date)
    },
    deleteUser(index) {
      this.$confirm('是否删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      	this.tableLoading = true
        let userId = this.tableData[index]._id
        userService.deleteUser(userId).then(res => {
        	this.tableLoading = false
          let result = res.data
          if (result.success) {
            this.tableData.splice(index, 1)
          }
        }).catch(err => {
        	this.tableLoading = false
        })
      }).catch(() => {

      })
    }
  }
};

</script>
<style lang="css" scoped>


</style>
