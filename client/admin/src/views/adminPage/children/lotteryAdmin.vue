<template>
<div class="lottery-admin">
  <el-card class="box-card">
    <div slot="header"
         class="clearfix">
      <el-button type="primary"
                 icon="plus">新增抽奖活动</el-button>
    </div>
  </el-card>
  <el-dialog title="新增抽奖活动"
             :visible.sync="dialogVisible"
             size="large">
    <el-form ref="formModel"
             :model="formModel"
             label-width="80px">
      <el-form-item label="活动名称"
                    prop="title"
                    :rules="requiredRule">
        <el-input v-model="formModel.title"></el-input>
      </el-form-item>
      <el-form-item label="活动内容">
        <el-input type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="formModel.content"></el-input>
      </el-form-item>
      <el-form-item label="奖品等级">
        <el-input-number v-model="formModel.level"
                         :min="1"
                         :max="10"
                         @change="handleLevelChange"></el-input-number>
      </el-form-item>
      <div class="prize-container"
           v-if="formModel.prizes.length">
        <el-card class="prize"
                 v-for="(item, index) in formModel.prizes"
                 :key="index">
          <h3>{{chineseNumber[index]}}等奖</h3>
          <el-form-item label="奖品名称"
                        prop="prizeTitle">
            <el-input v-model="item.prizeTitle"></el-input>
          </el-form-item>
          <el-form-item label="奖品内容说明">
            <el-input type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="请输入内容"
                      v-model="item.content"></el-input>
          </el-form-item>
          <el-form-item label="奖品图片">
            {{item.imgurl}}
            <el-upload :action="uploadUrl"
                       ref="uploader"
                       list-type="picture"
                       name="img">
              <el-button size="small"
                         type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="奖品数量">
            <el-input-number v-model="item.number"
                             :min="1"
                             :max="30"></el-input-number>
          </el-form-item>
        </el-card>
      </div>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
	    <el-button @click="dialogVisible = false">取 消</el-button>
	    <el-button type="primary" @click="addLottery">确 定</el-button>
	  </span>
  </el-dialog>
</div>

</template>

<script>
import api from '@/service/api';
import dataService from '@/service/lotteryService';
export default {

  name: 'lotteryAdmin',

  data() {
    return {
      dialogVisible: true,
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
        level: 3,
        prizes: []
      },
      oldLevel: 3,
      uploadUrl: api.UPLOAD_IMG,
      requiredRule: [
        {
          required: true,
          message: '此项为必填项',
          trigger: 'blur'
        }
      ]
    }
  },
  created() {
    for (let i = this.oldLevel; i > 0; i--) {
      this.addPrize()
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    addPrize() {
      this.formModel.prizes.push({
        prizeTitle: '',
        content: '',
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
    addLottery() {
      this.$refs.uploader.forEach((item, index) => {
      	if(item.uploadFiles){
      		item.uploadFiles.forEach(file => {
      			this.formModel.prizes[index].imgurl.push(file.response.filename)
      		})
      	}
      })
      this.formModel.prizes.forEach((item, index) => {
      	item.level = index + 1
      })
      console.log('====this.formModel====', this.formModel)
      dataService.addLottery(JSON.stringify(this.formModel)).then(data => {
        console.log('====res====', data)
        res.json({
        	success: true,
        	data: data
        })
      }).catch(err => {
      	res.json({
      		success: false,
      		msg: 'error'
      	})
      })
    }
  }
};

</script>

<style lang="scss">
.prize-container {
  .prize {
    margin: 10px;
    h3 {
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>
