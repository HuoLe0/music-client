<template>
    <div class="content-list">
        <ul class="section-content">
            <li class="content-item" v-for="(item,index) in contentList" :key=index @click="goAlbum(item,item.name)">
                <div class="kuo" >
                    <img :src="attachImageUrl(item.pic)" alt="" class="item-img">
                </div>
                <div class="mask">
                    <svg class="icon">
                        <use xlink:href="#icon-bofang"></use>
                    </svg>
                </div>
                <p class="item-name">{{item.name||item.title}}</p>
            </li>
        </ul>
    </div>
</template>
<script>
import {mixin} from '../mixins/index';
export default {
    mixins : [mixin],
    name: "content-list",
    props: ["contentList"],
    methods:{
        goAlbum(item,type){
            this.$store.commit('setTempList',item);
            if(item.id != 1){
                if(type){
                    this.$router.push({path:`singer-album/${item.id}`});
                }else{
                    this.$router.push({path:`song-list-album/${item.id}`});
                }
            }else{
                this.$router.push({path:`daily-recommend`});
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/content-list.scss';
</style>