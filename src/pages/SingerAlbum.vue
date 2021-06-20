<template>
    <div class="singer-album">
        <div class="album-slide">
            <div class="singer-img">
                <img :src="attachImageUrl(singer.pic)" alt="">
            </div>
            <ul class="info">
                <li v-if="singer.sex == 0 || singer.sex == 1">{{attach(singer.sex)}}</li>
                <li>生日：{{attachBirth(singer.birth)}}</li>
                <li>地区：{{singer.location}}</li>
            </ul>
        </div>
        <div class="album-content">
            <div class="intro">
                <h2>{{singer.name}}</h2>
                <span>{{singer.introduction}}</span>
            </div>
            <div class="content">
            <album-content :songList="data">
                <template slot="title">歌曲列表</template>
            </album-content>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" background layout="total,prev,pager,next"
                :current-page="currentPage" :page-size="pageSize" :total="totalNum"></el-pagination>
            </div>
        </div>
        </div>
        
    </div>
</template>

<script>
import AlbumContent from '../components/AlbumContent';
import {mixin} from '../mixins/index';
import {mapGetters} from 'vuex';
import {songOfSingerId} from '../api/index'
import Comment from '../components/Comment';
export default {
    name: 'singer-album',
    mixins: [mixin],
    components:{
        AlbumContent,
        Comment
    },
    data() {
        return {
            singer: {}, //当前歌手对象
            singerId: '',//前面传来的歌单id
            songList1: [],
            pageSize: 10, //页面大小，一页的数据
            currentPage: 1, //当前页，默认第一页
            totalNum: 0, //总数量
        }
    },
    computed:{
        ...mapGetters([
            'listOfSongs', //当前播放列表
            'tempList',//当前歌手对象
            'loginIn',//用户是否已登陆
            'userId',//当前用户id
        ]),
        //计算当前表格中的数据
        data(){
            return this.listOfSongs;
        }
    },
    created(){
        this.singerId = this.$route.params.id;
        this.singer = this.tempList;
        this.getSong();
        

    },
    methods:{
        //根据歌手id查询歌曲
        getSong(){
            songOfSingerId(this.singerId, this.currentPage, this.pageSize)
            .then(res => {
                this.$store.commit('setListOfSongs',res.data.rows);
                this.totalNum = res.data.total;
            }).catch(err =>{
                console.log(err);
            })
        },
        //获取性别
        attach(value){
            if(value==0){
                return '女';
            }else if(value == 1){
                return '男';
            }else{
                return "";
            }
        },
        //获取当前页
        handleCurrentChange(val){
            this.currentPage = val;
            songOfSingerId(this.singerId, this.currentPage, this.pageSize)
            .then(res => {
                this.$store.commit('setListOfSongs',res.data.rows);
                this.totalNum = res.data.total;
            }).catch(err =>{
                console.log(err);
            })
        },
    } 
}
</script>

<style lang="scss" scoped>
@import '../assets/css/singer-album.scss';
</style>