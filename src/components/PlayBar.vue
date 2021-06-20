<template>
    <div class="play-bar" :class="{show:toggle}">
        <div @click="showPlayer(toggle)" class="item-up" :class="{turn: toggle}">
            <svg class="icon">
                <use xlink:href="#icon-jiantou-xia-cuxiantiao"></use>
            </svg>
        </div>
        <div class="kongjian">
            <!-- 上一首 -->
            <div class="item" @click="prev">
                <svg class="icon">
                    <use xlink:href="#icon-ziyuanldpi"></use>
                </svg>
            </div>
            <!-- 播放 -->
            <div class="item" @click="togglePlay">
                <svg class="icon">
                    <use :xlink:href="playButtonUrl"></use>
                </svg>
            </div>
            <!-- 下一首 -->
            <div class="item" @click="next">
                <svg class="icon">
                    <use xlink:href="#icon-ziyuanldpi1"></use>
                </svg>
            </div>
            <!-- 歌曲图片 -->
            <div class="item-img" @click="toLyric">
                <img :src="picUrl"/>
            </div>
            <!-- 播放进度 -->
            <div class="playing-speed">
                <!-- 播放开始时间 -->
                <div class="current-time">{{nowTime}}</div>
                <div class="progress-box">
                    <div class="item-song-title">
                        <div>{{showLessTitle(title)}}</div>
                        <div @click="goSinger(id)">{{this.artist}}</div>
                    </div>
                    <div ref="progress" class="progress" @mousemove="mousemove">
                        <!-- 进度条 -->
                        <div ref="bg" class="bg" @click="updatemove">
                            <div ref="curProgress" class="cur-progress" :style="{width:curLength+'%'}"></div>
                        </div>
                        <!-- 拖动的点点 -->
                        <div ref="idot" class="idot" :style="{left:curLength+'%'}" @mousedown="mousedown" @mouseup="mouseup"></div>
                    </div>
                </div>
                <!-- 播放结束时间 -->
                <div class="left-time">{{songTime}}</div>
                <!-- 音量 -->
                <div class="item item-volume">
                    <svg v-if="volume == 0" class="icon">
                        <use xlink:href="#icon-yinliangjingyinheix"></use>
                    </svg>
                    <svg v-else class="icon">
                        <use xlink:href="#icon-yinliang1"></use>
                    </svg>
                    <el-slider class="volume" v-model="volume" :vertical="true"></el-slider>
                </div>
                <!--單曲循環-->
                <div class="item" @click="handleSingle(single)">
                    <svg :class="{single:isSingle}" class="icon">
                        <use xlink:href="#icon-singlePlay"></use>
                    </svg>
                </div>
                <!--随机播放-->
                <div class="item" @click="handleRandom(random)">
                    <svg :class="{rand:isRandom}" class="icon">
                        <use xlink:href="#icon-randomPlay"></use>
                    </svg>
                </div>
                <!-- 收藏 -->
                <div class="item" @click="handleCollect(userId,id)">
                    <svg :class="{active:isActive}" class="icon">
                        <use xlink:href="#icon-xihuan-shi"></use>
                    </svg>
                </div>
                <!-- 收藏到歌单 -->
                <div class="item" @click="changeSongList">
                    <svg class="icon">
                        <use xlink:href="#icon-shoucang"></use>
                    </svg>
                </div>
                <!-- 下载 -->
                <div class="item" @click="download">
                    <svg class="icon">
                        <use xlink:href="#icon-xiazai"></use>
                    </svg>
                </div>
                <!-- 当前播放的歌曲列表 -->
                <div class="item" @click="changeAside">
                    <svg class="icon">
                        <use xlink:href="#icon-liebiao"></use>
                    </svg>
                </div>
                
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import {download, setCollect, getCollectOfUserId, delCollectByUserIdSongId, setListSong, songOfId, getSingerOfId} from '../api/index';
export default {
    name: 'play-bar',
    inject:['reload'],
    data(){
        return {
            nowTime: '00:00',        //当前播放进度的时间
            songTime: '00:00',        //当前歌曲总时间
            curLength: 0,            //进度条的位置
            progressLength: 0,      //进度条的总长度
            mouseStartX:    0,      //拖拽开始位置
            tag: false,             //拖拽开始结束的标志，当开始拖拽，它的值才会变成true
            volume: 50,             //音量，默认一半
            toggle: false,          //显示或隐藏播放器
            singerId: '',
            random: false,          //随机播放
            single: false,          //单曲循环
            listSingleSong: [],
        }
    },
    computed: {
        ...mapGetters([
            'id',               //歌曲id
            'url',              //歌曲地址
            'isPlay',           //播放状态
            'playButtonUrl',   //播放状态的图标
            'picUrl',            //正在播放的音乐的图片
            'title',                  //歌名
            'artist',                 //歌手名
            'duration',                //音乐时长
            'curTime',                //当前音乐的播放位置
            'showAside',            //显示播放列表
            'showSongList',//显示歌单列表
            'listIndex', //正在播放的id
            'listOfSongs',//正在播放歌曲列表
            'autoNext',//自动播放下一首
            'loginIn',//用户是否已登陆
            'userId',//当前登录用户id
            'isActive',//当前歌曲是否已收藏
            'isRandom',//是否随机播放
            'isSingle',//是否单曲循环
        ])
    },
    watch:{
        //切换播放状态的图标
        isPlay() {
             if(this.isPlay){
                this.$store.commit('setPlayButtonUrl', '#icon-zanting');
            }else{
                this.$store.commit('setPlayButtonUrl', '#icon-bofang');
            }
        },
        curTime(){
            this.nowTime = this.formatSeconds(this.curTime);
            this.songTime = this.formatSeconds(this.duration);
            this.curLength = (this.curTime / this.duration) *100;
        },
        //音量变化
        volume(){
            this.$store.commit('setVolume',this.volume / 100);
        },
        //自动播放下一首
        autoNext(){
            this.next();
            this.nowTime = '00:01';
            this.togglePlay();
        }
    },
    mounted(){
        this.progressLength = this.$refs.progress.getBoundingClientRect().width;
        document.querySelector('.item-volume').addEventListener('click',function(e){
            document.querySelector('.volume').classList.add('show-volume');
            e.stopPropagation();
        },false);
        document.querySelector('.volume').addEventListener('click',function(e){
            e.stopPropagation();
        },false);
        document.addEventListener('click',function(){
            document.querySelector('.volume').classList.remove('show-volume');
        },false);
    },
    methods: {
        //提示信息
        notify(title, type){
            this.$notify({
                title: title,
                type: type
            })
        },
        //显示歌曲省略
        showLessTitle(title){
            if(title.split("").length>20){
                return title.substr(0,20) + "...";
                // console.log(title.substr(0,20))
            }else{
                return title;
            }
        },
        //转向歌手页面
        goSinger(id){
            songOfId(id).then( res => {
                this.singerId = res.singerId;
                getSingerOfId(this.singerId)
                .then(res => {
                    this.$store.commit('setTempList',res);
                    this.$router.push({name:'singer-album',params:{id:this.singerId}});
                }).catch(err => {
                    console.log(err);
                })
            }).catch(err => {
                console.log(err);
            })
        },
        //控制音乐播放、暂停
        togglePlay() {
            if(this.isPlay){
                this.$store.commit('setIsPlay', false);
            }else{
                this.$store.commit('setIsPlay', true);
            }
        },
        //解析时间
        formatSeconds(value){
            let theTime = parseInt(value);
            let result = '';    //返回值
            let hour = parseInt(theTime / 3600);    //小时
            let minute = parseInt((theTime / 60) % 60); //分钟
            let second = parseInt(theTime % 60);        //秒
            if(hour > 0){
                if(hour < 10){
                    result = '0' + hour + ":";
                }else{
                    result = hour + ":";
                }
            }
            if(minute > 0){
                if(minute < 10){
                    result += "0" + minute + ":";
                }else{
                    result += minute + ":";
                }
            }else{
                result += "00:";
            }
            if(second > 0){
                if(second < 10){
                    result += "0" + second;
                }else{
                    result += second;
                }
            }else{
                result += "00";
            }
            return result;
        },
        //拖拽开始
        mousedown(e){
            this.mouseStartX = e.clientX;
            this.tag = true;
        },
        //拖拽结束
        mouseup(){
            this.tag = false;
        },
        //拖拽中
        mousemove(e){
            if(!this.duration){
                return false;
            }
            if(this.tag){
                let movementX = e.clientX - this.mouseStartX;       //点点移动的距离
                let curLength = this.$refs.curProgress.getBoundingClientRect().width;
                let newPercent = ((movementX+curLength)/this.progressLength)*100;
                if(newPercent>100){
                    newPercent = 100;
                }
                this.curLength = newPercent;
                this.mouseStartX = e.clientX;
                this.changeTime(newPercent);
            }
        },
        //更改歌曲进度
        changeTime(percent){
            let newCurTime = (percent*0.01)* this.duration;
            this.$store.commit('setChangeTime',newCurTime);
        },
        //点击播放条切换播放进度
        updatemove(e){
            if(!this.tag){
                //进度条的左侧坐标
                let curLength = this.$refs.bg.offsetLeft;
                let newPercent = ((e.clientX - curLength) / this.progressLength) * 100;
                if(newPercent>100){
                    newPercent = 100;
                }else if(newPercent<0){
                    newPercent = 0;
                }
                this.curLength = newPercent;
                this.changeTime(newPercent);
            }
        },
        //显示播放中的歌曲列表
        changeAside(){
            this.$store.commit('setShowAside',true);
        },

        //显示当前用户歌单
        changeSongList(){
            this.$store.commit('setShowSongList',true);
        },
        //上一首
        prev(){
            if(this.listIndex != -1 && this.listOfSongs.length > 0){//当前处于不可能状态或者只有一首歌曲时，不执行
                if(this.single){
                    this.$store.commit('setListIndex',this.listIndex);//直接返回上一首
                }
                else if(this.listIndex > 0){//不是第一首
                    this.$store.commit('setListIndex',this.listIndex - 1);//直接返回上一首
                    
                }else{//第一首
                    this.$store.commit('setListIndex',this.listOfSongs.length - 1);//直接返回倒数第一首
                }
                this.toplay(this.listOfSongs[this.listIndex].url);
            }
        },
        //下一首
        next(){
            let len = this.listOfSongs.length;
            if(this.listIndex != -1 && len > 0){//当前处于不可能状态或者只有一首歌曲时，不执行
                if(this.single){
                    this.$store.commit('setListIndex',this.listIndex);//直接返回上一首
                }
                else if(!this.random){
                    if(this.listIndex < len - 1){//不是最后首
                        this.$store.commit('setListIndex',this.listIndex + 1);//直接返回下一首
                    
                    }else{//最后一首
                        this.$store.commit('setListIndex',0);//直接返回第一首
                    }
                }else{
                    let index1 = Math.floor(Math.random(0.1,1) * len);
                    this.$store.commit('setListIndex',index1);//直接返回第一首
                }
                this.toplay(this.listOfSongs[this.listIndex].url);
            }
        },
        //播放
        //播放音乐
        toplay: function(url){
            if(this.toggle){
                this.showPlayer();
            }
            if(url){
                this.$store.commit('setId',this.listOfSongs[this.listIndex].id);
                this.$store.commit('setUrl',"http://www.huole.xyz:9527"+url);
                this.$store.commit('setPicUrl',"http://www.huole.xyz:9527"+this.listOfSongs[this.listIndex].pic);
                this.$store.commit('setTitle',this.listOfSongs[this.listIndex].name.split('-')[0]);
                this.$store.commit('setArtist',this.listOfSongs[this.listIndex].name.split('-')[1]);
                this.$store.commit('setLyric',this.parseLyric(this.listOfSongs[this.listIndex].lyric));
                this.$store.commit('setIsActive',false);
                if(this.loginIn){
                    getCollectOfUserId(this.userId)
                        .then( res => {
                            for(let item of res){
                                // console.log(item)
                                if(item.songId == this.id){
                                    this.$store.commit('setIsActive',true);
                                    break
                                }
                            }
                        })
                }
            }
        },
        //解析歌词
        parseLyric(text){
            let lines = text.split("\n\n");   //将歌词换行分解成数组
            
            if(lines.length < 2){
                lines = text.split("\r\n\r\n");
            }
            if(lines.length < 2){
                lines = text.split("\r\n");
            }
            if(lines.length < 2){
                lines = text.split("\n");
            }
            let pattern = /\[\d{2}:\d{2}.\d{2,3}\]/g;//正则匹配时间
            let result = [];
            //对于歌词格式不对的，直接返回
            if(!(/\[.+\]/.test(text))){
                return [[0,text]]
            }
            //去掉前面格式不正确的行
            while(!pattern.test(lines[0])){
                lines = lines.slice(1);
            }
            //遍历每一行，形成一个每行带两个元素的数组，时间+歌词
            for(let item of lines){
                let time = item.match(pattern);//存时间
                let value = item.replace(pattern,'');//存后面的歌词
                for(let item1 of time){
                    let t = item1.slice(1,-1).split(":");//取出时间，换算成秒数组
                    if(value!=''){
                        result.push([parseInt(t[0],10) * 60 + parseFloat(t[1]), value]);
                    }
                }
            }
            //按照第一个元素时间排序
            result.sort(function(a,b){
                return a[0] - b[0];
            });
        },
        //转向歌词页面
        toLyric(){
            
            this.$router.push({path:`/lyric`});
            // this.reload();
        },
        //下载音乐
        download(){
            download(this.url)
            .then(res => {
                let content = res.data;
                let eleLink = document.createElement('a');
                eleLink.download = `${this.title}-${this.artist}.mp3`;
                eleLink.style.display = 'none';
                //把字符串转换为blob地址
                let blob = new Blob([content]);
                eleLink.href = URL.createObjectURL(blob);
                //把链接地址加到document里
                document.body.appendChild(eleLink);
                //触发点击时间
                eleLink.click();
                //然后移除掉新加的控件
                document.body.removeChild(eleLink);
            })
            .catch(err => {
                console.log(err);
            })
        },
        //单曲循环
        handleSingle(val){
            if(val){
                this.single = false;
                this.$store.commit('setIsSingle',false);
                this.notify("顺序播放","success");
            }else{
                this.single = true;
                this.random = false;
                this.$store.commit('setIsRandom',false);
                this.$store.commit('setIsSingle',true);
                this.notify("单曲循环",'success');
            }
        },
        //随机播放
        handleRandom(val){
            if(val){
                this.random = false;
                this.$store.commit('setIsRandom',false);
                this.notify("顺序播放","success");
            }else{
                this.random = true;
                this.single = false;
                this.$store.commit('setIsSingle',false);
                this.$store.commit('setIsRandom',true);
                this.notify("随机播放",'success');
            }
        },
        //处理收藏
        handleCollect(userId,songId){
            // console.log(userId)
            if(this.isActive){
                this.delCollect(userId,songId);
                if(this.$route.path == '/my-music'){
                    this.reload();
                }
            }else{
                this.collection();
                if(this.$route.path == '/my-music'){
                    this.reload();
                }
            }
        },
        //收藏
        collection(){
            if(this.loginIn){
                var params = new URLSearchParams();
                params.append('userId',this.userId);
                params.append('type',0);
                params.append('songId',this.id)
                setCollect(params).then( res => {
                    if(res.code == 1){
                        this.$store.commit('setIsActive',true);
                        this.notify('收藏成功','success');
                    }else if(res.code == 2){
                        this.notify(res.msg,'warning');  
                    }else{
                        this.notify("收藏失败",'error');
                    }
                }).catch(err => {
                    console.log(err);
                })
            }else{
                this.notify('请先登录','warning')
            }
        },
        //取消收藏
        delCollect(userId,songId){
            if(this.isActive){
                delCollectByUserIdSongId(userId,songId)
                    .then( res => {
                        if(res){
                        this.$store.commit('setIsActive',false);
                        this.notify('取消收藏成功','success');
                        }else{
                            this.notify("取消收藏失败",'error');
                        }
                    }).catch(err => {
                        console.log(err);
                    })
            }
        },
        //收藏到歌单
        handleSongList(userId,songId,songListId){
            let params = new URLSearchParams();
            params.append('songId',songId);
            params.append('songListId',songListId);
            setListSong(params)
        },
        //显示播放器
        showPlayer(toggle){
            this.toggle = !toggle;
        }
    }
}
</script>
<style  lang="scss" scoped>
@import '../assets/css/play-bar.scss';
</style>
