<template>
    <div class="player-container">
    <video-player class="vjs-custom-skin" :options="playerOptions"></video-player>
    </div>
</template>
<script>
 //引入video样式
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
  //引入hls.js
import videojs from 'videojs-contrib-hls'
import { songOfId } from '../api/index';

  export default {
    data () {
      return {
        songId: '',
        playerOptions: {
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          controls: true, //控制条
          preload: 'auto', //视频预加载
          muted: false, //默认情况下将会消除任何音频。
          loop: false, //导致视频一结束就重新开始。
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: 'video/mp4',
            src: ''//你所放置的视频的地址，最好是放在服务器上
          }],
          poster: "http://www.huole.xyz:9527/img/songListPic/1608282201302歌单封面.jpg", //你的封面地址（覆盖在视频上面的图片）
          width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试' //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        }
      }
    },
    created(){
        this.songId = this.$route.params.id;
        this.getUrl(this.songId);
    },
    methods:{
        getUrl(id){
            // console.log(this.playerOptions.sources[0].src)
            songOfId(id).then(res => {
              res = res.data;
                if(res.mv != null){
                    this.playerOptions.sources[0].src = res.mv;
                    // console.log(this.playerOptions.sources[0].src)
                }
                else{
                    this.playerOptions.sources[0].src = 'https://mvwebfs.yun.kugou.com/202101181845/950767654d6b8db02f59ea46ef5b62a8/G214/M09/10/10/docBAF-lR_SAZZZyBoxdFPp8vVM848.mp4';
                }
            })
        }
    }
  }
</script>

<style scoped>
.player-container {
    position: relative;
    margin-top: 100px;
    margin-left: 280px;
    height: 100%;
    width: 70%;
}
</style>