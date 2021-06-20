<template>
    <div class="song-list-album">
        <div class="album-slide">
            <div class="album-img">
                <img :src="attachImageUrl(songList1.pic)">
            </div>
            <div class="upload-img">
                <template >
                    <el-upload :action="uploadUrl(songList1.id)" :before-upload="beforeAvatorUpload" 
                        :on-success="handleAvatorSuccess">
                        <el-button :style="{display : showUpload}" size="mini">更新图片</el-button>
                    </el-upload>
                </template>
            </div>
            <div class="album-info">
                <h2>简介：</h2>
                <span>
                    {{songList1.introduction}}
                </span>
            </div>
        </div>
        <div class="album-content">
            <div class="album-title">
                <p>{{songList1.title}}</p>
            </div>
            <span>创建By：{{this.consumerName}}</span>
            <div class="album-score">
                <div>
                    <h3>歌单评分</h3>
                    <div>
                        <el-rate v-model="average" disabled></el-rate>
                    </div>
                </div>
                <span>{{average*2}}</span>
                <div>
                    <h3>评价</h3>
                    <div @click="setSongListRank">
                        <el-rate v-model="rank" allow-half show-text></el-rate>
                    </div>
                </div>
                
            </div>
            <div class="songs-body">
                <album-content :songList="listOfSongs">
                    <template slot="title">歌曲列表</template>
                </album-content>
                <div class="add">
                    <el-button :style="{display : showUpload}" type="primary" @click="handleAdd(songList1)">添加歌曲</el-button>
                    <el-button :style="{display : showUpload}" type="primary" @click="handleEdit(songList1)">编辑歌单信息</el-button>
                    <el-button :style="{display : showUpload}" type="danger" @click="handleDelete(songList1)">删除歌单</el-button> 
                </div>
                <comment :playId="songListId" :type="1"></comment>
            </div>
        </div>
        <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible" width="400px" center>
            <el-form :model="registerForm" ref="registerForm" label-width="80px" action="" id="tf">
                <el-form-item prop="singerName" label="歌手名字" size="mini">
                    <el-input v-model="registerForm.singerName" placeholder="歌手名字"></el-input>
                </el-form-item> 
                <el-form-item prop="songName" label="歌曲名字" size="mini">
                    <el-input v-model="registerForm.songName" placeholder="歌曲名字"></el-input>
                </el-form-item>  
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
                <el-button size="mini" @click="getAddSongId">确定</el-button>                
            </span>
        </el-dialog>
        <el-dialog title="修改歌单" :visible.sync="editVisible" width="400px" center>
            <el-form :model="form" ref="form" label-width="80px">
                <el-form-item prop="title" label="标题" size="mini">
                    <el-input v-model="form.title" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item prop="introduction" label="简介" size="mini">
                    <el-input v-model="form.introduction" placeholder="简介" type="textarea"></el-input>
                </el-form-item>    
                <el-form-item prop="style" label="风格" size="mini">
                    <el-input v-model="form.style" placeholder="风格"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="editVisible = false">取消</el-button>
                <el-button size="mini" @click="editSave">确定</el-button>                
            </span>
        </el-dialog>
        <el-dialog title="删除歌单" :visible.sync="delVisible" width="300px" center>
            <div align="center">删除不可恢复，是否确定删除？</div>
            <span slot="footer">
                <el-button size="mini" @click="delVisible = false">取消</el-button>
                <el-button size="mini" @click="deleteRow(songList1.id)">确定</el-button>                
            </span>
        </el-dialog>
    </div>
</template>

<script>
import AlbumContent from '../components/AlbumContent';
import {mixin} from '../mixins/index';
import {mapGetters} from 'vuex';
import {listSongOfSongListId, songOfId, songLikeName, songListOfId, setRank, getRank, getRankNum, setListSong, updateSongList, consumerOfId} from '../api/index';
import {delSongList} from '../api/index';
import Comment from '../components/Comment';
export default {
    name: 'song-list-album',
    inject:['reload'],
    mixins: [mixin],
    components:{
        AlbumContent,
        Comment
    },
    data() {
        return {
            songLists: [], //当前页面需要展示的歌曲列表
            songListId: '',//前面传来的歌单id
            songList1: [],
            consumerName: '',//歌单创建者
            showUpload: 'none',
            average: 0, //平均分
            rank: 0,//提交歌单分数
            centerDialogVisible: false, //添加弹窗是否显示
            editVisible: false,         //编辑弹窗是否显示
            delVisible: false,          //删除弹窗是否显示
            registerForm:{      //添加框
                singerName: '',     //歌手名字
                songName: ''        //歌曲名字
            },
            form:{      //编辑框
                id: '',
                title: '',
                introduction: '',
                style: ''
            },
        }
    },
    computed:{
        ...mapGetters([
            'listOfSongs', //当前播放列表
            'tempList',//当前歌单对象
            'loginIn',//用户是否已登陆
            'userId',//当前用户id
        ])
    },
    created(){
        this.songListId = this.$route.params.id;
        this.getSongId();
        this.songList(this.songListId);
        this.getSongListRank(this.songListId)
        // this.setSongListRank();
    },
    methods:{
        //获取当前歌单的歌曲列表
        getSongId(){
            listSongOfSongListId(this.songListId)
                .then(res => {
                    this.$store.commit('setListOfSongs',res.data);
                    // console.log(this.listOfSongs)
                }).catch(err =>{
                    console.log(err);
                })
        },
        //根据歌曲id获取歌曲信息
        getSongList(id){
            songOfId(id).then(res => {
                this.songLists.push(res.data);
            }).catch(err => {
                console.log(err);
            })
        },
        //拿到歌单信息,刷新后重复取
        songList(id){
            songListOfId(id).then( res =>{
                res = res.data;
                this.songList1 = res;
                this.getConsumer(res.userId);
                this.handleUpload(res);
            }).catch(err => {
                console.log(err)
            })
        },
        //获取用户名
        getConsumer(id){
            if(id){
                consumerOfId(id).then(res => {
                this.consumerName = res.data.username;
                }).catch(err => {
                    console.log(err);
                })
            }else{
                this.consumerName = 'DHU';
            } 
        },
        //获取歌单评分
        getSongListRank(id){
            getRank(id).then( res => {
                this.average = res/2;
            }).catch(err => {
                console.log(err);
            })
        },
        //提交评分
        setSongListRank(){
            if(this.loginIn){
                let params = new URLSearchParams();
                params.append('songListId',this.songListId);
                params.append('consumerId',this.userId);
                params.append('score',this.rank * 2);
                console.log(params)
                setRank(params).then(res => {
                    if(res.code == 1){
                        this.notify(res.msg,'success');
                        this.getSongListRank(this.songListId);
                    }else{
                        this.notify(res.msg,'error');
                    }
                }).catch(err => {
                        this.notify('评价失败','error');
                        console.log(err);
                })
            }else{
                this.rank = null;
                this.notify('请先登录','warning');
            }
        },
        //添加歌曲前的准备，获取到歌曲id        
        getAddSongId(){
            let _this = this;
            var songOfName = _this.registerForm.songName+"-"+_this.registerForm.singerName;
            songLikeName(songOfName).then(
                res => {
                    res = res.data;
                    _this.addSong(res[0].id);
                    _this.reload();
                }
            )
        },
        //添加歌曲
        addSong(songId){
            let _this = this;
            let params = new URLSearchParams();
            params.append('songId',songId);
            params.append('songListId',this.songListId);

            setListSong(params)
            .then(res => {
                if(res.success == true){
                    this.songList();
                    this.notify("添加成功","success");
                }else{
                    this.notify("添加失败","error");
                }
            })
            .catch(err => {
                console.log(err);
            });
            _this.centerDialogVisible = false;
        },
        //弹出添加页面
        handleAdd(row){
            if(row.userId == this.userId){
                this.centerDialogVisible = true;
            }else{
                this.notify('对不起，您没有权限操作','warning');
            }
        },
        //弹出编辑页面
        handleEdit(row){
            if(row.userId == this.userId){
                this.editVisible = true;
            this.form = {
                id: row.id,
                title: row.title,
                introduction: row.introduction,
                style: row.style
            }
            }else{
                this.notify('对不起，您没有权限操作','warning');
            }
        },
        //显示上传图标
        handleUpload(row){
            if(row.userId == this.userId){
                this.showUpload = '';
            }else{
                this.showUpload = 'none';
            }
        },
        //弹出删除窗口
        handleDelete(row){
            if(row.userId == this.userId){
                this.delVisible = true;
            }else{
                this.notify('对不起，您没有权限操作','warning');
            }
        },
        //保存编辑页面修改的数据
        editSave(){
            let params = new URLSearchParams();
            params.append('id',this.form.id);
            params.append('title',this.form.title);
            params.append('introduction',this.form.introduction);
            params.append('style',this.form.style);
            updateSongList(params)
            .then(res => {
                if(res.code == 1){
                    // this.songList();
                    this.notify("修改成功","success");
                    this.reload();
                }else{
                    this.notify("修改失败","error");
                }
            })
            .catch(err => {
                console.log(err);
            });
            this.editVisible = false;
        },
        //更新图片
        uploadUrl(id){
            // return `http://10.206.154.159:9527/songList/updateSongListPic?id=${id}`
            return `${"http://www.huole.xyz:9527"}/songList/updateSongListPic?id=${id}`
        },
        //上传图片之前的校验
        beforeAvatorUpload(file){
            const isJPG = (file.type === 'image/jpeg')||(file.type === 'image/png');
            if(!isJPG){
                this.$message.error('上传头像图片只能是jpg或png格式');
                return false;
            }
            const isLt2M = (file.size / 1024 /1024) < 2;
            if(!isLt2M){
                this.$message.error('上传头像图片大小不能超过2MB');
                return false;
            }
            return true;
        },
        //上传图片成功之后要做的工作
        handleAvatorSuccess(res){
            let _this = this;
            if(res.code == 1){
                // _this.getData();
                _this.$notify({
                    title: '上传成功',
                    type: 'success'
                });
                this.reload();
            }else{
                _this.$notify({
                    title: '上传失败',
                    type: 'error'
                });
            }
        },
         //删除一个歌单
        deleteRow(id){
            delSongList(id)
            .then(res => {
                if(res){
                    // this.getData();
                    this.notify("删除成功","success");
                    this.$router.push({path:'/my-list'});
                }else{
                    this.notify("删除失败","error");
                }
            })
            .catch(err => {
                console.log(err);
            });
            this.delVisible = false;
        },
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/song-list-album.scss';
</style>