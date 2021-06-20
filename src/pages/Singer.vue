<template>
    <div class="singer">
        <ul class="singer-header">
            <li v-for="(item,index) in singerStyle" :key="index" @click="handleChangeView(item)" 
            :class="{active:item.name == activeName}">
                {{item.name}}
            </li>
        </ul>
        <div>
            <content-list :contentList="data"></content-list>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" background layout="total,prev,pager,next"
                :current-page="curPage" :page-size="pageSize" :total="totalNum"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import ContentList from '../components/ContentList';
import {getAllSinger,getSingerByPager,getSingerOfSex} from '../api/index';
import {mixin} from '../mixins/index';
import {singerStyle} from '../assets/data/singer';
import {mapGetters} from 'vuex';
export default {
    name: 'song-list',
    mixins: [mixin],
    components:{
        ContentList,
    },
    data(){
        return{
            singerDatas: [],//歌手数据
            pageSize: 10, //页面大小，一页的数据
            currentPage: 1, //当前页，默认第一页
            singerStyle: [], //歌单风格
            activeName: '', //当前风格
            totalNum: 0,//总数量
        }
    },
    computed:{
        //计算当前表格中的数据
        data(){
            return this.singerDatas;
        },
        ...mapGetters([
            'curPage',//当前页面
            'allSingers',//所有歌shou
        ])
    },
    mounted(){
        this.singerStyle = singerStyle;
        this.getSinger();
        this.activeName = '全部歌手';
    },
    methods:{
        getSinger(){
            getSingerByPager(this.curPage, this.pageSize)
            .then( res => {
                this.singerDatas = res.data.rows;
                this.totalNum = res.data.total;
            }).catch( err => {
                console.log(err);
                this.notify("暂无相关歌单","warning");    
            })
            // if(this.allSingers != undefined){
            //     this.singerDatas = this.allSingers;
            // }
            // else{
            //     getAllSinger()
            //     .then( res => {
            //         // this.curPage = 1;
            //         this.singerDatas = res.data;
            //         this.$store.commit('setAllSingers',res.data);
            //     }).catch(err => {
            //         console.log(err);
            //         this.notify("暂无相关歌单","warning");    
            //     })
            // }
        },
        //获取当前页
        handleCurrentChange(val){
            // this.curPage = val;
            this.$store.commit('setCurPage',val);
            getSingerByPager(this.curPage, this.pageSize)
            .then( res => {
                this.singerDatas = res.data.rows;
                this.totalNum = res.data.total;
            }).catch( err => {
                console.log(err);
                this.notify("暂无相关歌单","warning");    
            })
        },
        //根据style查询对应歌手
        handleChangeView(item){
            this.activeName = item.name;
            this.singerDatas = [];
            if(item.name == '全部歌手'){
                this.getSinger();
            }else{
                this.goSingerOfSex(item.type);
            }
        },
        //根据性别查询歌手
        goSingerOfSex(sex){
            getSingerOfSex(sex).then( res => {
                // this.curPage = 1;
                this.$store.commit('setCurPage',1);
                this.singerDatas = res.data;
            }).catch( err => {
                console.log(err)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/singer.scss';
</style>