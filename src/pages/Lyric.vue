<template>
    <div class="lyric-container">
        <div class="song-lyric">
            <h1 class="lyric-title">{{title}}</h1>
            <h4 class="singer" @click="goSinger(singerId)">{{artist}}</h4>
            <!-- 有歌词 -->
            <ul class="has-lyric" v-if="lyr.length" key="index">
                <li v-for="(item,index) in lyr" v-bind:key="index">
                    {{item[1]}}
                </li>
            </ul>
            <!-- 没有歌词 -->
            <div v-else class="no-lyric" key="no-lyric">
                <span>暂无歌词</span>
            </div>
        </div>
        <div> 
             <comment :playId="songId" :type="0"></comment>
        </div>
    </div>   
</template>
<script>
import {mixin} from '../mixins/index'
import {mapGetters} from 'vuex';
import AlbumContent from '../components/AlbumContent';
import Comment from '../components/Comment';
import { songOfId, getSingerOfId } from '../api';
export default {
    name: 'lyric',
    mixins: [mixin],
    components:{
        AlbumContent,
        Comment
    },
    data(){
        return {
            lyr: [],   //当前歌曲的歌词
            songId: '',//前面传来的歌id
            singerId: '',
        }
    },
    mounted(){
        this.getSingerId(this.id);
    },
    computed: {
        ...mapGetters([
            'curTime',//当前播放时间
            'id', //当前播放歌曲id
            'lyric', //歌词
            'listIndex', //正在播放的id
            'listOfSongs',//正在播放歌曲列表
            'loginIn',//用户是否已登陆
            'userId',//当前用户id
            'title',
            'artist'
        ])
    },
    created(){
        this.songId = this.id;
        this.lyr = this.lyric;
    },
    watch: {
        id: function(){
            this.lyr = this.parseLyric(this.listOfSongs[this.listIndex].lyric)
        },
        curTime: function(){
            if(this.lyr.length>0){
                for(let i=0;i<this.lyr.length;i++){
                    if(this.curTime>=this.lyr[i][0]){
                        for(let j=0;j<this.lyr.length;j++){
                            document.querySelectorAll('.has-lyric li')[j].style.color = '#000';
                            document.querySelectorAll('.has-lyric li')[j].style.fontSize = '15px';
                        }
                        if(i>0){
                            document.querySelectorAll('.has-lyric li')[i].style.color = '#f572d8';
                            document.querySelectorAll('.has-lyric li')[i].style.fontSize = '25px';
                        }
                    }
                }
            }
        }
    },
    methods:{
        goSinger(id){
            getSingerOfId(id).then(res => {
                this.$store.commit('setTempList',res.data);
                this.$router.push({name:'singer-album',params:{id:id}});
            })
        },
        //获取歌曲标题
        getSingerId(id){
            songOfId(id).then( res => {
                res = res.data;
                this.singerId = res.singerId;
                this.lyr = this.parseLyric(res.lyric);
                // console.log(res)
            }).catch(err => {
                console.log(err);
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/lyric.scss';
</style>
