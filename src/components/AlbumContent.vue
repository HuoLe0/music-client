<template>
    <div class="content">
        <h1 class="title">
            <slot name="title"></slot>
            <hr/>
        </h1>
        <ul>
            <li>
                <div class="song-item">
                    <span class="item-index"></span>
                    <span class="item-title">歌曲名</span>
                    <span class="item-delete"></span>
                    <span class="item-name">歌手</span>
                    <span class="item-intro">专辑</span>
                    <span class="item-collect"></span>
                    <span :style="{display : showDelete}" class="item-delete"></span>
                    <span :style="{display : !showDelete}" class="item-delete"></span>
                </div>
            </li>
            <li v-for="(item,index) in songList" :key="index">
                <div class="song-item" >
                    <span class="item-index">
                        {{index + 1}}
                    </span>
                    <span class="item-title" @click="toplay(item.id,item.url,item.pic,index,item.name,item.lyric)">{{showLessName(item.name)}}</span>
                    <span class="item-delete" @click="goMv(item.id)">
                        <svg class="icon">
                            <use xlink:href="#icon-mv"></use>
                        </svg>
                    </span>
                    <span class="item-name" @click="goSinger(item.singerId)">{{item.name.split('-')[1]}}</span>
                    <span class="item-intro" @click="toplay(item.id,item.url,item.pic,index,item.name,item.lyric)">{{showLessIntro(item.introduction)}}</span>
                    <span class="item-collect" @click="changeSongList">
                        <i class="el-icon-more"></i>
                    </span>
                    <span :style="{display : showDelete}" class="item-delete"  @click="deleteFromSongList(item.id,songListId)">
                        <i class="el-icon-delete-solid"></i>
                    </span>
                    <span :style="{display : !showDelete}" class="item-delete"> </span>
                    <!-- <h1>{{parseLyric(item.lyric)}}</h1> -->
                </div>
                
            </li>
        </ul>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import {mixin} from "../mixins/index";
import { getSingerOfId, getAllConsumerSongList,setListSong, delListSong, songListOfId } from '../api/index'
export default {
    name: 'album-content',
    mixins:[mixin],
    inject:['reload'],
    props:[
        'songList'
    ],
    data() {
        return {
            userSongList: [],
            songListId: '',
            showDelete: 'none',
            consumerId: '',//歌单所有者id
            Urlpath: '',
            pathList: ["singer-album","song-list-album"],//专辑
        }
    },
    computed:{
        ...mapGetters([
            'showSongList', //是否显示播放列表
            'id',//播放中歌曲id
            'loginIn',//用户是否已登陆
            'userId',//当前登录用户id
        ])
    },
    mounted(){
        let _this = this;
        // _this.getUserSongList(this.userId);
        _this.getConsumerId(this.songListId);
        document.addEventListener('click',function(){
            _this.$store.commit('setShowSongList',false)
        },true);
    },
    created(){
        this.songListId = this.$route.params.id;
        this.Urlpath = this.$route.path;
    },
    methods:{
        goMv(id){
            this.$router.push({path: `/music-video/${id}`});
        },
        //显示歌曲省略
        showLessName(name){
            // console.log(name.split('-')[0].split('').length)
            if(name.split('-')[0].split('').length>20){
                return name.substr(0,20) + "...";
                // console.log(name.substr(0,20))
            }else{
                return name.split('-')[0];
            }
        },
        //显示专辑省略
        showLessIntro(intro){
            if(intro.split("").length>20){
                return intro.substr(0,20) + "...";
                // console.log(intro.substr(0,20))
            }else{
                return intro;
            }
        },
        goSinger(id){
            getSingerOfId(id).then(res => {
                this.$store.commit('setTempList',res.data);
                this.$router.push({name:'singer-album',params:{id:id}});
            })
        },
        //显示当前用户歌单
        changeSongList(){
            this.$store.commit('setShowSongList',true);
        },
        //提示信息
        notify(title, type){
            this.$notify({
                title: title,
                type: type
            })
        },
        //获取用户创建的歌单
        getUserSongList(userId){
            if(this.loginIn){
                getAllConsumerSongList(userId)
                .then( res => {
                // console.log(userId)
                    if(res.data){
                        this.userSongList = res.data;
                    }
                    else{
                        this.notify("您还没有歌单","warning");
                    }
                }).catch(err => {
                    console.log(err);
                    this.notify("暂无歌单","error");    
                })
            }
        },
        //添加歌曲到用户歌单
        addToSongList(songId,songListId){
            let _this = this;
            let params = new URLSearchParams();
            params.append('songId',songId);
            params.append('songListId',songListId);
            setListSong(params)
            .then(res => {
                if(res.success == true){
                    this.reload();
                    this.notify("添加成功","success");
                }else{
                    this.notify("添加失败","error");
                }
            })
            .catch(err => {
                console.log(err);
            });
        },
        //删除歌单内歌曲
        deleteFromSongList(songId,songListId){
            delListSong(songId,songListId)
            .then( res => {
                if(res){
                    this.reload();
                    this.notify('删除成功','success');
                }else{
                    this.notify('删除失败','error');
                }
            })
            .catch(err => {
                this.notify('删除失败','error');
                console.log(err);
            })
        },
        //显示删除图标
        handleDelete(consumerId,songListId){
            // console.log(this.Urlpath.split("/")[1])
            // console.log(this.pathList[1])
            if(consumerId == this.userId && songListId != undefined ){
                if(this.Urlpath.split("/")[1] == this.pathList[1]){
                    // console.log("www")
                    this.showDelete = '';
                }
            }else{
                this.showDelete = 'none';
            }
        },
        //获取歌单所有者id
        getConsumerId(songListId){
            if(songListId != undefined){
                songListOfId(songListId)
                .then( res => {
                    if(res.data){
                        this.consumerId = res.data.userId;
                        this.handleDelete(res.userId,songListId)
                    }
                })
                .catch(err => {
                    this.notify('请求失败','error');
                    console.log(err);
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/album-content.scss';
</style>