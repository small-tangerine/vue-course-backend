<template>
  <div>
      <video-player ref="videoPlayer"
                    class="video-player vjs-custom-skin"
                    :playsinline="true"
                    :options="playerOptions">
      </video-player>
  </div>
</template>

<script>

import {videoPlayer} from 'vue-video-player'
import 'video.js/dist/video-js.css'
export default {
  props: {
    video: {
      type: Object,
      require:true
    },
  },
  data () {
    return {
      paused: true,
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          // src: '../../static/video/test.mp4', // 路径
          src: this.video.url,
          type: 'video/mp4' // 类型
        }],
        poster: this.video.thumbUrl, // 你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: true,
          fullscreenToggle: true // 全屏按钮
        }
      }
    }
  },
  components: {
    videoPlayer
  },
  watch:{
    video:{
      handler(newValue,OldValue){
        if (newValue.url){
          this.playerOptions.sources[0].src=newValue.url
        }
        if (newValue.thumbUrl){
          this.playerOptions.poster=newValue.thumbUrl
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      immediate: true
    }
  }
}
</script>

<style lang="scss">
.video-info {
  width: 900px;
  box-sizing: border-box;

  .video-title {
    font-size: 18px;
    font-weight: 500;
    color: #212121;
    line-height: 26px;
    height: 26px;
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .tit {
      vertical-align: middle;
    }
  }

  .video-data {
    font-size: 12px;
    height: 16px;
    color: #999;
    display: flex;
    align-items: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 5px;
  }
}
</style>
