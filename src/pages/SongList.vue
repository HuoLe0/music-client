<template>
    <div class="song-list">
        <ul class="song-list-header">
            <li v-for="(item,index) in songStyle" :key="index" @click="handleChangeView(item.name)" 
            :class="{active:item.name == activeName}">
                {{item.name}}
            </li>
        </ul>
        <div>
            <content-list :contentList="data"></content-list>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" background layout="total,prev,pager,next"
                :current-page="curPage" :page-size="pageSize" :total="albumDatas.length"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import ContentList from '../components/ContentList';
import {getAllSongList, likeStyle, likeTitle} from '../api/index';
import {mixin} from '../mixins/index';
import {songStyle} from '../assets/data/songList';
import {mapGetters} from 'vuex';
export default {
    name: 'song-list',
    mixins: [mixin],
    components:{
        ContentList,
    },
    data(){
        return{
            albumDatas: [],//歌单数据
            pageSize: 10, //页面大小，一页的数据
            currentPage: 1, //当前页，默认第一页
            songStyle: [], //歌单风格
            activeName: '', //当前风格
        }
    },
    computed:{
        //计算当前表格中的数据
        data(){
            return this.albumDatas.slice((this.curPage - 1) * this.pageSize,this.curPage * this.pageSize)
        },
        ...mapGetters([
            'curPage',//当前页面
            'allSongLists',//所有歌单
        ])
    },
    mounted(){
        this.songStyle = songStyle;
        this.getSongList();
        this.activeName = '全部歌单';
    },
    methods:{
        getSongList(){
            if(this.allSongLists != undefined){
                this.albumDatas = this.allSongLists;
            }
            else{
                getAllSongList()
                    .then( res => {
                        // this.$store.commit('setCurPage',1);
                        this.albumDatas = res.data;
                        this.$store.commit('setAllSongLists',res);
                    }).catch(err => {
                        console.log(err);
                        this.notify("暂无相关歌单","warning");    
                })
            }
            
        },
        //获取当前页
        handleCurrentChange(val){
            // this.curPage = val;
            this.$store.commit('setCurPage',val);
        },
        //根据style查询对应歌单
        handleChangeView(name){
            this.activeName = name;
            this.albumDatas = [];
            if(name == '全部歌单'){
                this.getSongList();
            }else{
                this.goSongListOfStyle(name);
            }
        },
        //根据style查询
        goSongListOfStyle(style){
            likeStyle(style).then( res => {
                this.$store.commit('setCurPage',1);
                this.albumDatas = res.data;
            }).catch( err => {
                console.log(err)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/song-list.scss';
</style>