<template>
<div class="bk">
     <div class="swiper">
        <el-carousel :interval="4000" type="card" height="480px">
            <el-carousel-item v-for="(item,index) in songList" :key="index">
                <img :src="attachImageUrl(item.pic)" @click="goAlbum(item,item.name)">
            </el-carousel-item>
        </el-carousel>
    </div>
</div>
</template>

<script>
import {swiperList} from '../assets/data/swiper';
import {getRandomSongList} from '../api/index';
import {mapGetters} from 'vuex';
import {mixin} from '../mixins/index';
export default {
    name: "swiper",
    mixins: [mixin],
    data() {
        return {
            swiperList: [],
            songList: []
        }
    },
    computed:{
        ...mapGetters([
            'allSongLists',//所有歌单
        ])
    },
    created() {
        this.swiperList = swiperList;
        this.getSongList();
    },
    methods:{
        getSongList(){//获取前十条歌单
            getRandomSongList().then(res =>{             
                this.songList = res.data;
            }).catch(err => {
                console.log(err);
            })
        },
        goAlbum(item,type){
            this.$store.commit('setTempList',item);
            if(type){
                this.$router.push({path:`singer-album/${item.id}`});
            }else{
                this.$router.push({path:`song-list-album/${item.id}`});
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/swiper.scss';
</style>