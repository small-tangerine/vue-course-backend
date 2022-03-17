<template>
  <div>
    <div @click="editCropper()">
      <img :src="avatar" title="点击上传头像" class="img-circle img-lg" alt=""></div>
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body @opened="modalOpened">
      <el-row>
        <el-col :xs="24" :md="12" :style="{height: '350px'}">
          <vue-cropper
            v-if="visible"
            ref="cropper"
            :img="options.img"
            :info="true"
            :auto-crop="options.autoCrop"
            :auto-crop-width="options.autoCropWidth"
            :auto-crop-height="options.autoCropHeight"
            :fixed-box="options.fixedBox"
            :info-true="true"
            enlarge="1"
            @realTime="realTime"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{height: '350px'}">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img" alt="">
          </div>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col :lg="2" :md="2">
          <el-upload action="#" :http-request="requestUpload" :show-file-list="false" :before-upload="beforeUpload">
            <el-button size="small">
              上传
              <i class="el-icon-upload el-icon--right"/>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{span: 1, offset: 2}" :md="2">
          <el-button icon="el-icon-plus" size="small" @click="changeScale(1)"/>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)"/>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()"/>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-refresh-right" size="small" @click="rotateRight()"/>
        </el-col>
        <el-col :lg="{span: 2, offset: 6}" :md="2">
          <el-button   type="primary" size="small" @click="uploadImg()">提 交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import { VueCropper } from 'vue-cropper'
import { subUrlFileName } from '@/utils'
import { uploadAvatar } from '@/api/user'
export default {
  components: { VueCropper },
  data() {
    return {
      fileName: subUrlFileName(store.getters.avatar),
      // 是否显示弹出层
      open: false,
      visible: true,
      // 弹出层标题
      title: '修改头像',
      options: {
        img: store.getters.avatar, // 裁剪图片的地址
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: true // 固定截图框大小 不允许改变
      },
      previews: {}
    }
  },
  computed: {
    avatar() {
      return store.getters.avatar
    }
  },
  methods: {
    // 编辑头像
    editCropper() {
      this.open = true
    },
    // 打开弹出层结束时的回调
    modalOpened() {
      this.visible = true
    },
    // 覆盖默认的上传行为
    requestUpload() {
    },
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 上传预处理
    beforeUpload(file) {
      if (file.type.indexOf('image/') === -1) {
        this.$message.error('请上传正确的图片')
        // console.log()
      } else {
        this.fileName =file.name
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          // console.log(reader.result)
          this.options.img = reader.result
        }
      }
    },
    // 上传图片
    uploadImg () {
      this.$refs.cropper.getCropBlob(data => {
        const formData = new FormData()
        formData.append('image', data, this.fileName)
        uploadAvatar(formData).then(res => {
          if (res.error === 0) {
            this.$message.success(res.msg)
            this.open = false
            this.options.img = res.data.url
            this.previews.url =res.data.url
            store.commit('user/SET_AVATAR', res.data.url)
            this.visible = false
          }
        })
      })
    },
    // 实时预览
    realTime(data) {
      // console.log(data)
      this.previews = data
    }
  }
}
</script>
