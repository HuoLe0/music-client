<template>
    <transition name="slide-fade">
        <div class="the-aside" v-if="showSongList">
            <h2 class="title">添加到我的歌单</h2>
            <ul class="menus">
                <li v-for="(item,index) in userSongList" :key="index" :class="{'is-play': id==item.id}"
                @click="addToSongList(id,item.id)">
                    {{item.title}}
                    <!-- {{index}} -->
                </li>
            </ul>
        </div>
    </transition>
</template>
<script>
import {mapGetters} from 'vuex';
import {download, setCollect, getCollectOfUserId, setListSong, getAllConsumerSongList} from '../api/index';
export default {
    name: 'the-user-song-list',
    inject:['reload'],
    data() {
        return {
            userSongList: [],
        }
    },
    computed:{
        ...mapGetters([
            'showSongList', //是否显示播放列表
            'id',//播放中歌曲id
            'loginIn',//用户是否已登陆
            'userId',//当前登录用户id
            'isActive',//当前歌曲是否已收藏
        ])
    },
    mounted(){
        let _this = this;
        _this.getUserSongList(this.userId);
        document.addEventListener('click',function(){
            _this.$store.commit('setShowSongList',false)
        },true);
    },
    methods: {
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
        }
    }
}
</script>


<style  lang="scss" scoped>
@import '../assets/css/the-aside.scss';
</style>
