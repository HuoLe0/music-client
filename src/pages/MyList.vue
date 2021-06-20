<template>
    <div class="song-list">
        <ul class="song-list-header">
            <li v-for="(item,index) in songStyle" :key="index" @click="handleChangeView(item.name)" 
            :class="{active:item.name == activeName}">
                {{item.name}}
            </li>
            <el-button type="primary"  @click="centerDialogVisible = true">添加歌单</el-button>
        </ul>
        <div>
            <my-content-list :myContentList="data"></my-content-list>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" background layout="total,prev,pager,next"
                :current-page="curPage" :page-size="pageSize" :total="albumDatas.length"></el-pagination>
            </div>
        </div>
        <el-dialog title="添加歌单" :visible.sync="centerDialogVisible" width="400px" center>
            <el-form :model="registerForm" ref="registerForm" label-width="80px">
                <el-form-item prop="title" label="标题" size="mini">
                    <el-input v-model="registerForm.title" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item prop="introduction" label="简介" size="mini">
                    <el-input v-model="registerForm.introduction" placeholder="简介" type="textarea"></el-input>
                </el-form-item>
                <el-form-item prop="style" label="风格" size="mini">
                    <el-input v-model="registerForm.style" placeholder="风格"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
                <el-button size="mini" @click="addSongList">确定</el-button>                
            </span>
        </el-dialog>
    </div>
</template>
<script>
import MyContentList from '../components/MyContentList';
import {getAllConsumerSongList, getAllSongList, likeStyle, likeTitle, setConsumerSongList} from '../api/index';
import {mixin} from '../mixins/index';
// import {songStyle} from '../assets/data/songList';
import {mapGetters} from 'vuex';
export default {
    name: 'song-list',
    mixins: [mixin],
    inject:['reload'],
    components:{
        MyContentList,
    },
    data(){
        return{
            albumDatas: [],//歌单数据
            pageSize: 10, //页面大小，一页的数据
            currentPage: 1, //当前页，默认第一页
            songStyle: [
                {name:'我的歌单'},
            ], //歌单风格
            activeName: '', //当前风格

            centerDialogVisible: false, //添加弹窗是否显示
            editVisible: false,         //编辑弹窗是否显示
            delVisible: false,          //删除弹窗是否显示
            registerForm:{      //添加框
                title: '',
                introduction: '',
                style: ''
            },
            form:{      //编辑框
                id: '',
                title: '',
                introduction: '',
                style: ''
            },
            tableData: [],
            tempData: [],
            select_word: '',
            pageSize: 5,    //分页每页大小
            currentPage: 1,  //当前页
            idx: -1,          //当前选择项
            multipleSelection: []   //哪些项已经打勾
        }
    },
    computed:{
        //计算当前表格中的数据
        data(){
            return this.albumDatas.slice((this.curPage - 1) * this.pageSize,this.curPage * this.pageSize)
        },
        ...mapGetters([
            'curPage',//当前页面
            'userId',//当前登录用户id
        ])
    },
    mounted(){
        
        this.getSongList(this.userId);
        this.activeName = '我的歌单';
    },
    methods:{
        getSongList(id){
            getAllConsumerSongList(id)
                .then( res => {
                    this.$store.commit('setCurPage',1);
                    this.albumDatas = res.data;
                    // console.log(res)
                }).catch(err => {
                    console.log(err);
                    this.notify("暂无相关歌单","warning");    
                })
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
        },
        //添加歌单
        addSongList(){
            let params = new URLSearchParams();
            params.append('title',this.registerForm.title);
            params.append('pic','/img/songListPic/list.jpg');
            params.append('introduction',this.registerForm.introduction);
            params.append('style',this.registerForm.style);
            params.append('userId',this.userId)
            setConsumerSongList(params)
            .then(res => {
                if(res.code == 1){
                    // this.getData();
                    this.notify("添加成功","success");
                    this.reload();
                }else{
                    this.notify("添加失败","error");
                }
            })
            .catch(err => {
                console.log(err);
            });
            this.centerDialogVisible = false;
        },
    }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/song-list.scss';
</style>