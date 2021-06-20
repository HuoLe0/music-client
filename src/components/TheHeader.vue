<template>
<div>
  <div class="the-header">    
      <div class="header-logo" @click="goHome">
          <svg class="icon">
              <use xlink:href = "#icon-ruererji"></use>
          </svg>
          music
      </div>
      <ul class="navbar">
          <li :class="{active: item.name == activeName}" v-for="item in navMsg" :key="item.path" @click="goPage(item.path,item.name)">
              {{item.name}}
          </li>
          <li>
              <div class="header-search">
                  <input type="text" placeholder="搜索音乐" @keyup.enter="goSearch()" v-model="keywords">
                  <div class="search-btn" @click="goSearch()">
                      <svg class="icon">
                          <use xlink:href = "#icon-sousuo"></use>
                      </svg>
                  </div>
              </div>
          </li>
          <li v-show="!loginIn" :class="{active: item.name == activeName}" v-for="item in loginMsg" :key="item.path" @click="goPage(item.path,item.name)">
              {{item.name}}
          </li>
      </ul>
      <div class="header-right" v-show="loginIn">
          <div id="user">
              <img :src='attachImageUrl(userImg)'>
          </div>
          <ul class="menu">
                <li v-for="(item, index) in menuList" :key="index" @click="goMenuList(item.path)">
                    <i :class="item.icon"></i>
                    {{item.name}}
                </li>
          </ul>
      </div>
  </div>
</div>
</template>

<script>
import {mapGetters} from 'vuex';
import { consumerOfId } from '../api';
import {navMsg} from '../assets/data/header';
import {loginMsg,menuList} from '../assets/data/header';

export default {
  name: 'the-header',
  inject:['reload'],
  data() {
      return {
          navMsg: [], //导航栏
          loginMsg: [],//右侧导航栏
          keywords: '', //搜索关键词
          menuList: [],//下拉菜单
          userImg: '',
      }
  },
  computed:{
      ...mapGetters([
          'activeName',
          'loginIn',
          'avator',
          'username',
          'userId'
      ])
  },
  created(){
      this.navMsg = navMsg;
      this.loginMsg = loginMsg;
      this.menuList = menuList;
  },
  mounted(){
      this.getUserImg();
      document.querySelector('#user').addEventListener('click',function(e){
          document.querySelector('.menu').classList.add("show");
          e.stopPropagation()  //关键在于阻止冒泡
      },false);
      document.querySelector('.menu').addEventListener('click',function(e){
          e.stopPropagation()  //点击菜单内部时，阻止时间冒泡，这样，点击内部时，菜单不会关闭
      },false);
      document.addEventListener('click',function(){
          document.querySelector('.menu').classList.remove('show');
      },false)
  },
  methods: {
      //提示信息
        notify(title, type){
            this.$notify({
                title: title,
                type: type
            })
        },
        goHome(){
            this.$router.push({path: "/"});
        },
        goPage(path,name){
            if(!this.loginIn && path == '/my-music'){
                this.notify('请先登录','warning');
                this.$router.push({path: '/login-in'});
            }else if(!this.loginIn && path == '/my-list'){
                this.notify('请先登录','warning');
                this.$router.push({path: '/login-in'});
            }else{
                this.$store.commit('setActiveName',name);
                this.$router.push({path: path});
            }
            
        },
        goSearch(){
            this.reload();
            this.$router.push({path:'/search',query:{keywords: this.keywords}});
        },
        //获取图片地址
        attachImageUrl (srcUrl) {
            return srcUrl? "http://www.huole.xyz:9527" + srcUrl : '../assets/img/user.jpg';
        },
        goMenuList(path){
            if(path == '/login-in'){
                this.$store.commit('setLoginIn',false);
                this.$store.commit('setUserId',null);
                this.$store.commit('setIsActive',false);
                this.$router.push({path: path});
            }else{
                this.$router.push({path: path});
            }
        },
        //获取用户头像
        getUserImg(){
            consumerOfId(this.userId).then( res => {
                this.userImg = res.data.avator;
                
            }).catch( err => {
                console.log(err);
            })
        },
    }
  
}
</script>

<style  lang="scss" scoped>
@import '../assets/css/the-header.scss';


</style>
