<template>
    <div class="login-logo">
        <svg class="logo">
            <use xlink:href="#icon-ruererji"></use>
        </svg>
    </div>
</template>
<script>

import {rules, cities} from '../assets/data/form'
export default {
    name: 'login-logo',

    data() {
        return {
            registerForm: {
                username: '',  //用户名
                password: '', //密码
                sex:'',//性别
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
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/login-logo.scss';
</style>