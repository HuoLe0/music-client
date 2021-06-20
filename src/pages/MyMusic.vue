<template>
    <div class="my-music">
        <div class="album-slide">
            <div class="album-img">
                <img :src="attachImageUrl(avator)" alt="">
            </div>
           <ul class="album-info">
                <li>昵称：{{username}}</li>
                <li>性别： {{userSex}}</li>
                <li>生日：{{birth}}</li>
                <li>地区：{{location}}</li>
                
            </ul>
        </div>
        <div class="album-content">
            <div class="album-title">
                <li>个性签名：{{introduction}}</li>
            </div>
            <div class="songs-body">
                <album-content :songList = "collectList">
                <template slot="title">我的收藏</template>
            </album-content>
        </div>
        </div>
        
    </div>
</template>

<script>
import {mixin} from '../mixins/index';
import {mapGetters} from 'vuex';
import AlbumContent from '../components/AlbumContent';
import {consumerOfId, getCollectOfUserId, songOfId} from '../api/index';
export default {
    name: 'my-music',
    mixins: [mixin],
    components:{
        AlbumContent
    },
    data(){
        return {
            avator: '',//用户头像
            username: '',//用户名
            userSex: '',//用户性别
            birth: '',//用户生日
            location: '',//用户地区
            introduction: '',//用户前面
            collection: [],//用户收藏歌曲列表
            collectList: [],//收藏的歌曲列表（带歌曲详情）
        }
    },
    computed:{
        ...mapGetters([
            'listOfSongs',//当前播放列表
            'userId',//当前登录用户id
        ])
    },
    mounted(){
        this.getMsg(this.userId);
        this.getCollection(this.userId);
    },
    methods:{
        getMsg(userId){
            consumerOfId(userId).then( res => {
                res = res.data;
                this.avator = res.avator;
                this.username = res.username;
                if(res.ssex == 0){
                    this.userSex = '女';
                }else if(res.sex == 1){
                    this.userSex = '男';
                }else{
                    this.userSex = '保密';
                }
                this.birth = this.attachBirth(res.birth);
                this.location = res.location;
                this.introduction = res.introduction;
            }).catch(err => {
                    console.log(err);
            })
        },
        //获取我的收藏列表
        getCollection(userId){
            getCollectOfUserId(userId).then( res => {
                this.collection = res;
                //通过歌曲id获取歌曲信息
                for(let item of this.collection){
                   this.collectList.push(item);
                }
            }).catch(err => {
                    console.log(err);
            })
            this.$store.commit('setListOfSongs',this.collectList);
        },
        //通过歌曲id获取歌曲信息
        // getSongOfIds(id){
        //     songOfId(id)
        //         .then( res => {
        //             this.collectList.push(res.data);
        //         })
        //         .catch(err => {
        //             console.log(err);
        //         })
        //         this.$store.commit('setListOfSongs',this.collectList);
        // }
    }
    
}
</script>
<style lang="scss" scoped>
@import '../assets/css/my-music.scss'
</style>