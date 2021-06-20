<template>
    <div class="upload">
        <p class="title">修改头像</p>
        <hr/>
        <div class="section">
            <el-upload drag :action="uploadUrl()" :show-file-list="false" :on-success="handleAvatorSuccess"
            :before-upload="beforeAvatorUpload">
                <i class="el-icon-upload"></i>
                <div>
                    将文件拖到此处或点击修改头像
                </div>
                <div slot="tip" class="tip">PS：只能上传jpg/png文件，大小不能超过10M</div>
            </el-upload>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import {updateConsumer,consumerOfId} from '../api/index'
import {mixin} from '../mixins/index'
export default {
    name: 'upload',
    mixins: [mixin],
    inject:['reload'],
    computed:{
        ...mapGetters([
            'userId',
        ])
    },
    data(){
        return {
            
        }
    },
    methods:{
        //上传地址
        uploadUrl(){
            return `${"http://www.huole.xyz:9527"}/consumer/updateConsumerAvator?id=${this.userId}`
        },
        //上传成功
        handleAvatorSuccess(res,file){
            if(res.code == 1){
                
                this.$store.commit('setAvator',res.avator);
                this.notify('修改成功','success');
                this.$router.go(0);
            }else{
                this.notify('修改失败','error');
            }
        },
        //上传之前的校验
        beforeAvatorUpload(file){
            const isJPG = file.type == ('image/jpeg' || 'image/png');
            const isLt10M = file.size / 1024 / 1024 < 10;
            if(!isJPG){
                this.notify('上传图片只能为jpg/png格式','error');
            }
            if(!isLt10M){
                this.notify('上传图片大小不能超过10M','error');
            }
            return true;
        },
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/upload.scss'
</style>