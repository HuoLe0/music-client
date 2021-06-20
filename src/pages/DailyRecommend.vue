<template>
    <div class="song-list-album">
        <div class="album-slide">
            <div class="album-img">
                <img :src="attachImageUrl(pic)">
            </div>
            <div class="album-info">
                <h2>简介：</h2>
                <span>
                    {{songList.introduction}}
                </span>
            </div>
        </div>
        <div class="album-content">
            <div class="album-title">
                <p>{{songList.title}}</p>
            </div>
            <span>创建By：Yourself</span>
            
            <div class="songs-body">
                <album-content :songList="dailySongs">
                    <template slot="title">歌曲列表</template>
                </album-content>
                
            </div>
        </div>
        
            
    </div>
</template>

<script>
import AlbumContent from '../components/AlbumContent';
import {mixin} from '../mixins/index';
import {mapGetters} from 'vuex';
import { getAllSong, getRandom, songListOfId } from '../api/index';
import {delSongList} from '../api/index';
import Comment from '../components/Comment';
export default {
    name: 'daily-recommend',
    inject:['reload'],
    mixins: [mixin],
    components:{
        AlbumContent,
        Comment
    },
    data() {
        return {
            songList: [], //当前页面需要展示的歌单
            songs: [],
            pic: '/img/songListPic/1610876016178心跳.jpg',
        }
    },
    computed:{
        ...mapGetters([
            'allSongs',//所有歌
            'listOfSongs', //当前播放列表
            'dailySongs',//每日推荐
            'tempList',//当前歌单对象
            'loginIn',//用户是否已登陆
            'userId',//当前用户id
        ])
    },
    created(){
        this.getInfo(1);
        this.getSong();
    },
    methods:{
        //获取歌单信息
        getInfo(id){
            songListOfId(id)
            .then( res => {
                this.songList = res;
            })
            .catch( err => {
                console.log(err);
            })
        },
        //随机获取20收歌曲
        getSong(){
            getRandom()
            .then( res => {
                res = res.data;
                this.songs = res;
                this.pic = this.songs[0].pic;
                // console.log(this.songs)
                this.$store.commit('setDailySongs',this.songs);
                this.$store.commit('setListOfSongs',this.songs);
            }).catch(err => {
                console.log(err);
            })
            this.pic = this.dailySongs[0].pic;
        },
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/song-list-album.scss';
</style>