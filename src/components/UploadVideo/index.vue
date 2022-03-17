<template>
  <div>
    <uploader
      :autoStart="false"
      :options="options"
      :file-status-text="statusText"
      class="uploader-example"
      @file-complete="fileComplete"
      @complete="complete"
      @file-success="fileSuccess"
      @files-added="filesAdded"
      @file-removed="fileRemoved"
      @file-error="onFileError"
    >
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop>
        <p>将文件拖到此处，或点击下方按钮上传视频</p>
        <uploader-btn>选择视频</uploader-btn>
      </uploader-drop>
      <uploader-files></uploader-files>
    </uploader>
    <br/>
    <el-button type="warning"  v-if="fileList.length>0" size="mini" @click="allRemove">移除视频</el-button>
  </div>
</template>

<script>
import SparkMD5 from "spark-md5";
import {getToken} from "@/utils/auth";
import {uploadMergeFile} from "@/api/file";

export default {
  data() {
    return {
      skip: false,
      options: {
        target: "//localhost/api/v3/upload/chunk",
        chunkSize: '10485760',
        // 开启服务端分片校验功能
        testChunks: true,
        headers: {
          // 在header中添加的验证，请根据实际业务来
          Authorization: getToken()
        },
        parseTimeRemaining: function (timeRemaining, parsedTimeRemaining) {
          return parsedTimeRemaining
            .replace(/\syears?/, "年")
            .replace(/\days?/, "天")
            .replace(/\shours?/, "小时")
            .replace(/\sminutes?/, "分钟")
            .replace(/\sseconds?/, "秒");
        },
        // 服务器分片校验函数
        checkChunkUploadedByResponse: (chunk, message) => {
          const result = JSON.parse(message);
          if (result.data.skipUpload) {
            this.skip = true;
            return true;
          }
          return (result.data.uploaded || []).indexOf(chunk.offset + 1) >= 0;
        },
      },
      attrs: {
        accept: "image/*",
      },
      statusText: {
        success: "上传成功",
        error: "上传出错了",
        uploading: "上传中...",
        paused: "暂停中...",
        waiting: "等待中...",
        cmd5: "计算文件MD5中...",
      },
      fileList: [],
      disabled: true,
    };
  },
  watch: {
    fileList(o, n) {
      this.disabled = false;
    },
  },
  methods: {
    fileRemoved() {
      this.fileList = []
    },
    onFileError() {
      if (this.fileList.length === 1) {
        return
      }
      this.fileList = []
    },
    fileSuccess(rootFile, file, response, chunk) {
        uploadMergeFile({
          identifier: file.uniqueIdentifier,
          filename: file.name,
          totalChunks: chunk.offset,
        }).then((res) => {
          if (res.error === 0) {
            // console.log("上传成功");
            this.$emit("videoInfo",res.data)
          } else {
            // console.log(res);
          }
        })
          .catch(function (error) {
            // console.log(error);
          });
    },
    fileComplete(rootFile) {
      // 一个根文件（文件夹）成功上传完成。
      // console.log("fileComplete", rootFile);
      // console.log("一个根文件（文件夹）成功上传完成。");
    },
    complete() {
      // 上传完毕。
      // console.log("complete");
    },
    filesAdded(file, fileList, event) {
      if ((file || []).length > 1) {
        this.$message.error("只能上传一个视频")
        file.ignored = true
        return;
      }
      let file_type = file[0].name.substring(file[0].name.lastIndexOf(".") + 1);
      if (!(file_type==='mp4')) {
        this.$message.error("请上传MP4格式的视频文件")
        file.ignored = true
        return
      }
      if (this.fileList.length >= 1) {
        this.$message.error("只能上传一个视频")
        file.ignored = true
        return
      }
      file.forEach((e) => {
        this.fileList.push(e);
        this.computeMD5(e);
      });
    },
    allRemove() {
      this.fileList.map((e) => {
        e.cancel();
      });
      this.fileList = [];
    },
    computeMD5(file) {
      let fileReader = new FileReader();
      let time = new Date().getTime();
      let blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice;
      let currentChunk = 0;
      const chunkSize = 1024 * 1024 * 10;
      let chunks = Math.ceil(file.size / chunkSize);
      let spark = new SparkMD5.ArrayBuffer();
      // 文件状态设为"计算MD5"
      file.cmd5 = true; //文件状态为“计算md5...”
      file.pause();
      loadNext();
      fileReader.onload = (e) => {
        spark.append(e.target.result);
        if (currentChunk < chunks) {
          currentChunk++;
          loadNext();
        } else {
          let md5 = spark.end();
          console.log(
            `MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${
              file.size
            } 用时：${new Date().getTime() - time} ms`
          );
          spark.destroy(); //释放缓存
          file.uniqueIdentifier = md5; //将文件md5赋值给文件唯一标识
          file.cmd5 = false; //取消计算md5状态
          file.resume(); //开始上传
        }
      };
      fileReader.onerror = function () {
        this.error(`文件${file.name}读取出错，请检查该文件`);
        file.cancel();
      };

      function loadNext() {
        let start = currentChunk * chunkSize;
        let end =
          start + chunkSize >= file.size ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
      }
    },
  },
};
</script>

<style>
.uploader-example {
  padding: 15px;
  font-size: 12px;
}

.uploader-example .uploader-btn {
  margin-right: 4px;
}

.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
