<template>
  <div>
  <el-upload
    ref="imgUpload"
    :class="{hide:showUpload}"
    action=""
    :http-request="uploadImg"
    :file-list="fileList"
    list-type="picture-card">
    <i slot="default" class="el-icon-plus"></i>
    <div slot="file" slot-scope="{file}">
      <img
        class="el-upload-list__item-thumbnail"
        :src="file.url" alt=""
      >
      <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(file)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleRemove()"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
    </div>
  </el-upload>
  <el-dialog :visible.sync="dialogVisible">
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
  </div>
</template>

<script>
import {uploadFile} from "@/api/file";

export default {
  name: "index",
  props:{
    typeId:{
      type:Number,
      require:true
    },
    url:{
      type:String,
      require:true,
      default:'http://localhost/image/default.png'
    },
  },
  data(){
    return{
      fileList:[],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      courseForm: {
        title: undefined
      },
      showUpload: false,
      file:undefined
    }
  },
  created() {
    this.setFileList(this.url)
  },
  methods: {
    setFileList(url){
      this.fileList.push({url:this.url})
      this.showUpload=true
    },
    // 限制文件上传的个数
    onChange(file, list) {
      if (list && list.length === 1) {
        this.showUpload = true
      }
      if (list.length > 1 && file.status !== "fail") {
        list.splice(0, 1);
      } else if (file.status === "fail") {
        this.$message.error("上传失败，请重新上传！");
        list.splice(0, 1);
      }
      this.file =list[0]
    },
    uploadImg(params) {
      this.showUpload = true
      let form = new FormData();
      // 文件对象
      form.append('image', params.file, params.file.name)
      uploadFile(form).then(res => {
        if (res.error === 0) {
          this.$message.success(res.msg)
          this.$emit("uploadImage",res.data.url,this.typeId)
        } else {
          this.$refs.imgUpload.clearFiles()
          this.showUpload = false
        }
      }).catch(() => {
        this.$refs.imgUpload.clearFiles()
        this.showUpload = false
      })
    },
    handleRemove() {
      this.$refs.imgUpload.clearFiles()
      this.showUpload = false
      this.fileList=[]
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },
  watch:{
  }
}
</script>

<style>
.hide .el-upload--picture-card {
  display: none;
}
</style>

