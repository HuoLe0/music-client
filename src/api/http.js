import axios from 'axios';
import { error } from 'shelljs';
import VueRouter from 'vue-router';
axios.defaults.timeout = 5000; //超时时间5s
axios.defaults.withCredentials = true; //允许跨域
//Content-type 响应头
axios.defaults.headers.post['Content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//基础url
axios.defaults.baseURL = "http://www.huole.xyz:9527";
// axios.defaults.baseURL = 'http://10.206.154.159:9527';
// axios.defaults.baseURL = 'http://www.huole.xyz:9527'

//响应拦截器
axios.interceptors.response.use(
    response => {
        //如果response里面的status是200，说明访问到接口
        if(response.status == 200){
            return Promise.resolve(response);
        }else{
            return Promise.reject(response);
        }
    },
    error => {
        if(error.response.status){
            switch(error.response.status){
                case 401://未登录
                    VueRouter.replace({
                        path: '/',
                        query:{
                            redirect: VueRouter.currentRouter.fullPath
                        }
                    });
                case 404://未找到
                    break;
            }
            return Promise.reject(error.response);
        }
    }
);

/**
 * 封装get方法
 */
export function get(url,params={}){
    return new Promise((resolve,reject) => {
        axios.get(url,{params:params})
        .then(response => {
            resolve(response.data);
        })
        .catch(err =>{
            reject(err);
        })
    });
}

/**
 * 封装post方法
 */
export function post(url,data={}){
    return new Promise((resolve,reject) => {
        axios.post(url,data)
        .then(response => {
            resolve(response.data);
        })
        .catch(err =>{
            reject(err);
        })
    });
}