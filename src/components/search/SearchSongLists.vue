<template>
    <div class="search-song-Lists">
        <content-list :contentList="albumDatas"></content-list>
    </div>
</template>
<script>
import ContentList from '../ContentList';
import {likeTitle} from '../../api/index';
import {mixin} from '../../mixins/index';
export default {
    name: 'search-song-lists',
    mixins: [mixin],
    components:{
        ContentList,
    },
    data(){
        return{
            albumDatas: [],
        }
    },
    mounted(){
        this.getSearchList();
    },
    methods:{
        getSearchList(){
            if(!this.$route.query.keywords){
                this.notify("您输入的内容为空","warning")
            }else{
                likeTitle(this.$route.query.keywords)
                    .then( res => {
                        if(res.data){
                            this.albumDatas = res.data;
                        }else{
                            this.notify("暂无相关歌曲","warning")

                        }
                    })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../assets/css/search-song-Lists.scss';
</style>