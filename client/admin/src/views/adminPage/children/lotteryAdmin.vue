<template>
  <div class="lottery-admin">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button type="primary" icon="plus" @click="dialogVisible = true">新增抽奖活动</el-button>
      </div>
      <div class="content">
        <el-table :data="tableData" style="width: 100%" border v-loading="tableLoading">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <div class="lottery-detail">
            		<p>活动内容：{{scope.row.content}}</p>
            		<img :src="getImgUrl(scope.row.companyLogo)" alt="logo">
                <ul v-if="scope.row.prizes && scope.row.prizes.length">
                  <li v-for="(item, index) in scope.row.prizes" :key="index">
                    <div class="table-prize">
                      <h3>{{chineseNumber[item.level - 1]}}等奖</h3>
                      <p>奖品名：{{item.prizeTitle}}</p>
                      <p>奖品内容：{{item.prizeContent}}</p>
                      <p>奖品数量：{{item.number}}</p>
                      <p>奖品图片：<img v-for="(img, imgIndex) in item.imgurl" :key="index" :src="getImgUrl(img)" alt=""></p>
                    </div>
                  </li>
                </ul>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="活动名称" prop="title">
          </el-table-column>
          <el-table-column label="公司名" prop="companyName">
          </el-table-column>
          <el-table-column label="奖品等级" prop="level" width="100">
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" width="240">
            <template slot-scope="scope">
              {{formatDate(scope.row.createTime)}}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state == 0">未开始</el-tag>
              <el-tag v-if="scope.row.state == 1" type="success">已开始</el-tag>
              <el-tag v-if="scope.row.state == 2" type="gray">已停止</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.state != 1" @click="startLottery(scope.$index)">开始</el-button>
              <el-button type="text" v-if="scope.row.state == 1" @click="stopLottery(scope.$index)">停止</el-button>
              <el-button type="text" @click="clearLotteryWinner(scope.$index)">重置</el-button>
              <el-button type="text" @click="showLotteryWinner(scope.$index)">查看结果</el-button>
              <el-button type="text" @click="deleteLottery(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog title="新增抽奖活动" :visible.sync="dialogVisible" size="large">
      <el-form ref="formModel" :model="formModel" label-width="80px">
        <el-form-item label="活动名称" prop="title" :rules="requiredRule">
          <el-input v-model="formModel.title"></el-input>
        </el-form-item>
        <el-form-item label="活动内容">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="formModel.content"></el-input>
        </el-form-item>
        <el-form-item label="公司名" prop="companyName">
          <el-input v-model="formModel.companyName"></el-input>
        </el-form-item>
        <el-form-item label="公司logo" prop="companyName">
          <el-upload :action="uploadUrl" list-type="picture" name="img" :on-success="handleUploadCompanyLogo" ref="logoUploader">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="奖品等级">
          <el-input-number v-model="formModel.level" :min="1" :max="10" @change="handleLevelChange"></el-input-number>
        </el-form-item>
        <div class="prize-container" v-if="formModel.prizes.length">
          <el-card class="prize" v-for="(item, index) in formModel.prizes" :key="index">
            <h3>{{chineseNumber[index]}}等奖</h3>
            <el-form-item label="奖品名称" prop="prizeTitle">
              <el-input v-model="item.prizeTitle"></el-input>
            </el-form-item>
            <el-form-item label="奖品内容说明">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="item.prizeContent"></el-input>
            </el-form-item>
            <el-form-item label="奖品图片">
              <el-upload :action="uploadUrl" ref="uploader" list-type="picture" name="img">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="奖品数量">
              <el-input-number v-model="item.number" :min="1" :max="30"></el-input-number>
            </el-form-item>
          </el-card>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
  	    <el-button @click="dialogVisible = false">取 消</el-button>
  	    <el-button type="primary" @click="addLottery">确 定</el-button>
  	  </span>
    </el-dialog>
    <el-dialog title="查看中奖结果" :visible.sync="winnerVisible" size="small">
      <div class="final-winners"
             v-if="currentLottery">
        <div class="winner-container"
             v-for="(item, index) in currentLottery.prizes"
             :key="index">
          <h4>{{chineseNumber[item.level-1]}}等奖：{{item.prizeTitle}}</h4>
          <ul>
            <li v-for="(winner, winnerIndex) in item.winners"
                :key="winnerIndex">{{winner.tel}}</li>
          </ul>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="winnerVisible=false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/service/api'
import dataService from '@/service/lotteryService'
import fileService from '@/service/fileService'
import util from '@/util/'
export default {

  name: 'lotteryAdmin',

  data() {
    return {
      dialogVisible: false,
      chineseNumber: [
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九',
        '十'
      ],
      formModel: {
        title: '',
        content: '',
        companyName: '',
        companyLogo: '',
        level: 3,
        prizes: []
      },
      oldLevel: 3,
      uploadUrl: api.UPLOAD_IMG,
      requiredRule: [{
        required: true,
        message: '此项为必填项',
        trigger: 'blur'
      }],
      tableData: [],
      winnerVisible: false,
      currentLottery: null,
      tableLoading: true
    }
  },
  created() {
    for (let i = this.oldLevel; i > 0; i--) {
      this.addPrize()
    }
    dataService.findAllLottery().then(res => {
      this.tableLoading = false
      console.log('====res====', res)
      let result = res.data
      if (result.success) {
        this.tableData = result.data
      }
    }).catch(err => {
      this.tableLoading = false
    })
  },
  methods: {
    getImgUrl(img){
      return fileService.getImgUrl(img)
    },
    formatDate(date) {
      return util.formatDate(date)
    },
    onSubmit() {
      console.log('submit!')
    },
    addPrize() {
      this.formModel.prizes.push({
        prizeTitle: '',
        prizeContent: '',
        imgurl: [],
        number: 1
      })
    },
    changePrizes() {
      let difference = this.formModel.level - this.oldLevel
      if (difference > 0) {
        for (let i = difference; i > 0; i--) {
          this.addPrize()
        }
      } else if (difference < 0) {
        this.formModel.prizes.splice(this.formModel.level, -difference)
      }
      this.oldLevel = this.formModel.level
    },
    handleLevelChange() {
      setTimeout(() => {
        this.changePrizes()
      }, 10)
    },
    handleUploadCompanyLogo(response, file, fileList){
    	console.log('====response====', response)
    	if(response.success){
    		this.formModel.companyLogo = response.filename
    	}
    },
    clearForm(){
    	this.formModel = {
        title: '',
        content: '',
        companyName: '',
        companyLogo: '',
        level: 1,
        prizes: []
      }
      this.oldLevel = 1
      this.$refs.uploader.forEach((item, index) => {
        item.clearFiles()
      })
      this.$refs.logoUploader.clearFiles()
      this.addPrize()
    },
    addLottery() {
      this.$refs.uploader.forEach((item, index) => {
        if (item.uploadFiles) {
          item.uploadFiles.forEach(file => {
            this.formModel.prizes[index].imgurl.push(file.response.filename)
          })
        }
      })
      this.formModel.prizes.forEach((item, index) => {
        item.level = index + 1
      })
      console.log('====this.formModel====', this.formModel)
      this.tableLoading = true
      dataService.addLottery(JSON.stringify(this.formModel)).then(res => {
        this.tableLoading = false
        console.log('====res====', res)
        let result = res.data
        if (result.success) {
          this.tableData.unshift(result.data)
          this.dialogVisible = false
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.clearForm()
        }
      }).catch(err => {
        this.tableLoading = false
        this.$message({
          message: '添加请求失败',
          type: 'error'
        })
      })
    },
    startLottery(index) {
      if (this.tableData.some(item => item.state == 1)) {
        this.$message({
          message: '同时只能激活一个活动',
          type: 'warning'
        })
        return
      }
      let id = this.tableData[index]._id
      this.tableLoading = true
      dataService.startLottery(id).then(res => {
        this.tableLoading = false
        console.log('========', res)
        let result = res.data
        if (result.success) {
          this.tableData[index].state = 1
        }
      }).catch(err => {
        this.tableLoading = false
      })
    },
    stopLottery(index) {
      let id = this.tableData[index]._id
      this.tableLoading = true
      dataService.stopLottery(id).then(res => {
        this.tableLoading = false
        console.log('========', res)
        let result = res.data
        if (result.success) {
          this.tableData[index].state = 2
        }
      }).catch(err => {
        this.tableLoading = false
      })
    },
    deleteLottery(index) {
      console.log('====delete====', index)
      this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = this.tableData[index]._id
        dataService.deleteLottery(id).then(res => {
          console.log('====res====', res)
          if (res.data.success) {
            this.tableData.splice(index, 1)
          } else {
            this.$message({
              message: '删除失败',
              type: 'warning'
            })
          }
        }).catch(err => {
          this.$message({
            message: '删除请求失败',
            type: 'error'
          })
        })
      }).catch(() => {

      })
    },
    clearLotteryWinner(index){
      this.$confirm('此操作将永久重置获奖数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = this.tableData[index]._id
        this.tableLoading = true
        dataService.clearLotteryWinner(id).then(res => {
          this.tableLoading = false
          console.log('====res====', res)
          if (res.data.success) {
            this.$message({
              message: '已重置获奖数据',
              type: 'success'
            })
          } else {
            this.$message({
              message: '重置失败',
              type: 'warning'
            })
          }
        }).catch(err => {
          this.tableLoading = false
          this.$message({
            message: '重置请求失败',
            type: 'error'
          })
        })
      }).catch(() => {

      })
    },
    showLotteryWinner(index){
      this.currentLottery = this.tableData[index]
      this.winnerVisible = true
    }
  }
};

</script>
<style lang="scss">
.lottery-admin{
  .prize-container {
    .prize {
      margin: 10px;
      h3 {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }

  .lottery-detail {
    max-height: 500px;
    overflow: auto;
    li {
      margin-bottom: 30px;
    }
    img {
      max-width: 50%;
      display: block;
    }
  }

  .final-winners{
    ul{
      list-style: none;
      padding-left: 20px;
    }
  }
}


</style>
