<template>
  <div id="app">
    
    <the-header/>    
    <router-view class="music-content" v-if="isRouterAlive"/>
    <song-audio/>
    <the-aside/>
    <the-user-song-list/>
    <play-bar/>
    <scroll-top/>
    <the-footer/>   
  </div>
</template>

<script>
import ScrollTop from './components/ScrollTop.vue';
import TheFooter from './components/TheFooter.vue';
import TheHeader from './components/TheHeader.vue';
import SongAudio from './components/SongAudio.vue';
import TheAside from './components/TheAside.vue';
import PlayBar from './components/PlayBar.vue';
import TheUserSongList from './components/TheUserSongList.vue';

export default {
  name: 'App',
  components: {
    TheHeader,
    ScrollTop,
    TheFooter,
    SongAudio,
    TheAside,
    PlayBar,
    TheUserSongList,
  },
  
  data () {
    return {
      isRouterAlive: true
    }
  },
  created(){
    //刷新缓存改进
    if (window.localStorage.getItem("list") ) {
        this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(window.localStorage.getItem("list"))))
    } 

    window.addEventListener("beforeunload",()=>{
        window.localStorage.setItem("list",JSON.stringify(this.$store.state))
    })
  },
  //刷新路由
  provide(){
    return {
      reload:this.reload
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => (this.isRouterAlive = true))
   }   
 }


}
</script>

<style  lang="scss" scoped>
@import './assets/css/app.scss';
</style>
