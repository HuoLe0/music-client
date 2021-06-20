<template>
<div class="bk">
    <!-- <loginLogo/> -->
    <div class="login">
        <div class="login-head">
            <span>用户登录</span>
        </div>
        <el-form :model="loginForm" ref="loginForm" label-width="70px" class="demo-ruleForm" :rules="rules">
            <el-form-item prop="username" label="用户名">
                <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码">
                <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
            </el-form-item>
            <div class="login-btn">
                <el-button @click="goSignUp">注册</el-button>
                <el-button type="primary" @click="handleLoginIn">登录</el-button>
            </div>
        </el-form>
    </div>
</div>
    
</template>

<script>
import {rules, cities} from '../assets/data/form'
import loginLogo from '../components/LoginLogo'
import {verifyConsumer,loginIn} from '../api/index'
import {mixin} from '../mixins/index'
import md5 from 'js-md5'
export default {
    name: 'login-in',
    mixins: [mixin],
    components: {
        loginLogo
    },
    data() {
        return {
            loginForm: {
                username: '',  //用户名
                password: '', //密码
                sex: '',//性别
                phoneNum: '',//手机号
                email: '',//邮箱
                birth:'',//生日
                introduction: '',//签名
                location:'',//地区
            },
            cities: [],//所有地区--省市直辖区
            rules: {},//表单提交的规则
        }
    },
    created(){
        this.rules = rules;
        this.cities = cities;
    },
    mounted(){
        this.changeIndex('登录')
    },
    methods:{
        handleLoginIn(){
            let _this = this;
            let params = new URLSearchParams();
            params.append('username',this.loginForm.username);
            params.append('password',md5(this.loginForm.password));
            loginIn(params)
                .then(res => {
                    if(res.code == 1){
                        _this.notify('登录成功','success');
                        _this.$store.commit('setLoginIn',true);
                        _this.$store.commit('setUserId',res.userMsg[0].id);
                        _this.$store.commit('setUsername',res.userMsg[0].username);
                        _this.$store.commit('setAvator',res.userMsg[0].avator);
                        // console.log(res.userMsg[0].avator)
                        setTimeout(function(){
                            _this.changeIndex('首页');
                            _this.$router.push({path: '/'})
                        },2000)
                    }else{
                        _this.notify('登录失败，请检查用户名或密码','error');
                    }
                })
                .catch(err => {
                    _this.notify('请检查用户名或密码','error');
                })
        },
        goSignUp(){
            this.changeIndex('注册');
            this.$router.push({path: '/sign-up'});
        },
        changeIndex(value){
            this.$store.commit('setActiveName',value);
        }
    }
}
</script>
<style lang="scss" scoped>
// @import '../assets/css/login-in.scss';
.bk{
    background: url('../assets/img/bk.jpeg');
    overflow: auto;
    padding-bottom: 60%;
    background-attachment: fixed;
    background-position: center;
    background-size: cover;
}

.login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 160px;
  margin-left: -190px;
  margin-top: -150px;
  padding: 40px;
  border-radius: 5px;
  /* background: #fff; */
  background: rgba(255,255,255,0.5);
  color: rgba(255,255,255,1);
  

  .login-head {
    text-align: center;
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: 600;
  }
  .login-btn {
      padding-left: 70px;
      padding-bottom: 100%;
      margin-top: -10px;
      position: relative;
  }
}

</style>