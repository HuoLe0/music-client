import { getCollectOfUserId, songLikeName } from "../api";
import {mapGetters} from 'vuex';
export const mixin = {
    computed:{
        ...mapGetters([
            'showAside', //是否显示播放列表
            'listOfSongs', //当前歌曲列表
            'id',//播放中歌曲id
            'loginIn',//用户是否已登陆
            'userId',//当前登录用户id
            'isActive',//当前歌曲是否已收藏
        ])
    },
    methods: {
        //提示信息
        notify(title, type){
            this.$notify({
                title: title,
                type: type
            })
        },
        //获取图片地址
        attachImageUrl (srcUrl) {
            return srcUrl? "http://www.huole.xyz:9527" + srcUrl : '/img/consumerAvator/user.jpg';
        },
        //根据歌名模糊搜索
        getSong(){
           if(!this.$route.query.keywords){
            this.$store.commit('setListOfSongs',[]);
               this.notify("你输入的内容为空",'warning');
           }else{
               songLikeName(this.$route.query.keywords).then( res => {
                   res = res.data;
                   if(!res.length){
                    this.$store.commit('setListOfSongs',[]);
                        this.notify("暂无相关歌曲",'warning');
                   }else{
                        this.$store.commit('setListOfSongs',res);
                   }
               }).catch(err => {
                   console.log(err)
               })
           }
        },
        //播放
        toplay: function(id,url,pic,index,name,lyric){
            this.$store.commit('setId',id);
            this.$store.commit('setUrl',"http://www.huole.xyz:9527"+url);
            this.$store.commit('setPicUrl',"http://www.huole.xyz:9527"+pic);
            this.$store.commit('setListIndex',index);
            this.$store.commit('setTitle',name.split('-')[0]);
            this.$store.commit('setArtist',name.split('-')[1]);
            this.$store.commit('setLyric',this.parseLyric(lyric));
            this.$store.commit('setIsActive',false);
            if(this.loginIn){
                getCollectOfUserId(this.userId)
                    .then( res => {
                        for(let item of res){
                            if(item.songId == id){
                                this.$store.commit('setIsActive',true);
                                break
                            }
                        }
                    })
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
            return result;
        },
        //获取生日
        attachBirth(val){
            if(val){
                return val.substr(0,10);
            }else{
                return '未知';
            }
            
        },
    }
}