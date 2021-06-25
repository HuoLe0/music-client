import Axios from "axios";
import url from "postcss-url";
import {get,post} from "./http";

//判断管理员是否登陆成功
export const getLoginStatus = (params) => post(`admin/login/status`,params);

//歌手
export const getAllSinger = () => get(`singer/selectAll`);

//前十个歌手
export const getTenSinger = () => get(`singer/selectTen`);

//分页歌手
export const getSingerByPager = (page,size) => get(`singer/selectByPager?page=${page}&size=${size}`);


//歌手性别
export const getSingerOfSex = (sex,page,size) => get(`singer/selectBySex?sex=${sex}&page=${page}&size=${size}`);

//歌手名
export const getSingerOfName = (name) => get(`singer/selectByName?name=${name}`);

//添加歌手
export const setSinger = (params) => post(`singer/add`,params);

//更新歌手
export const updateSinger = (params) => post(`singer/update`, params);

//删除歌手
export const delSinger = (id) => get(`singer/delete?id=${id}`);

//查询歌手
export const getSingerOfId = (id) => get(`singer/selectById?id=${id}`);



//全部歌曲
export const getAllSong = () => get(`song/selectAll`);

export const getRandom = () => get(`song/selectRandom`);

//添加歌曲
export const setSong = (params) => post(`song/add`,params);

//更新歌曲
export const updateSong = (params) => post(`song/update`, params);

//删除歌曲
export const delSong = (id) => get(`song/delete?id=${id}`);

//根据歌手id查询歌曲
export const songOfSingerId = (id,page,size) => get(`song/selectBySingerId?singerId=${id}&page=${page}&size=${size}`);

//根据id查询歌曲
export const songOfId = (id) => get(`song/selectById?id=${id}`);

//根据歌名查询歌曲
export const songOfName = (name) => get(`song/selectByName?name=${name}`);

//根据歌名模糊查询歌曲
export const songLikeName = (name) => get(`song/selectLikeName?name=${name}`);


//全部歌单
export const getAllSongList = () => get(`songList/selectAll`);

//用户全部歌单
export const getAllConsumerSongList = (userId) => get(`songList/selectAllConsumer?userId=${userId}`);

//分页歌单
export const getSongListByPager = (page,size) => get(`songList/selectByPager?page=${page}&size=${size}`);

//前十个歌单
export const getTenSongList = () => get(`songList/selectTen`);

//随机歌单
export const getRandomSongList = () => get(`songList/selectRandom`);

//添加歌单
export const setSongList = (params) => post(`songList/add`,params);

//添加歌单
export const setConsumerSongList = (params) => post(`songList/addByConsumer`,params);


//更新歌dan
export const updateSongList = (params) => post(`songList/update`, params);
export const updateSongListPic = (id) => post(`songList/updateSongListPic?id=${id}`);
//删除歌dan
export const delSongList = (id) => get(`songList/delete?id=${id}`);

//根据标题查询歌单
export const songListOfTitle = (id) => get(`songList/selectByTitle?title=${title}`);

//根据id查询歌单
export const songListOfId = (id) => get(`songList/selectById?id=${id}`);

//根据标题模糊查询歌单
export const likeTitle = (title) => get(`songList/selectLikeTitle?title=${title}`);

//根据风格模糊查询歌单
export const likeStyle = (style,page,size) => get(`songList/selectLikeStyle?style=${style}&page=${page}&size=${size}`);


//全部歌单歌曲
export const getAllListSong = () => get(`listSong/allListSong`);

//添加歌单歌曲
export const setListSong = (params) => post(`songList/addSong`,params);

//更新歌单歌曲
export const updateListSong = (params) => post(`listSong/update`, params);

//删除歌单歌曲
export const delListSong = (songId,songListId) => get(`songList/deleteSong?songId=${songId}&songListId=${songListId}`);

//根据歌手id查询歌单歌曲
export const listSongOfSongId = (songId) => get(`listSong/songOfSingerId?singerId=${songId}`);

//根据id查询歌单歌曲
export const listSongOfSongListId = (songListId) => get(`songList/selectSongs?songListId=${songListId}`);



//用户
export const getAllConsumer = () => get(`consumer/selectAll`);

//添加用户
export const setConsumer = (params) => post(`consumer/add`,params);

//更新用户
export const updateConsumer = (params) => post(`consumer/update`, params);

//删除用户
export const delConsumer = (id) => get(`consumer/delete?id=${id}`);

//用户id查询
export const consumerOfId = (id) => get(`consumer/selectById?id=${id}`);

//校验用户
export const verifyConsumer = (username,password) => get(`consumer/verifyPassword?username=${username}&password=${password}`);

//用户登录
export const loginIn = (params) => post(`consumer/login`,params);




//下载音乐
export const download = (url) => Axios({
    method: 'get',
    url: url,
    responseType: 'blob'
});



//新增评分
export const setRank = (params) => post(`rank/add`,params);
//获取指定歌单的评分
export const getRank = (songListId) => get(`rank/rank?songListId=${songListId}`);

//获取指定歌单的评分人数
export const getRankNum = (songListId) => get(`rank/num?songListId=${songListId}`);



//提交评论
export const setComment = (params) => post(`comment/add`,params);
//点赞
export const setLike = (params) => post(`comment/like`,params);
//获取指定歌单或歌曲的评论
export const getAllComment = (type,id) => {
    if(type == 0){//歌曲评论
        return get(`comment/commentOfSongId?songId=${id}`);
    }else {//歌单评论
        return get(`comment/commentOfSongListId?songListId=${id}`);
    }
} 



//新增收藏
export const setCollect = (params) => post(`collect/add`,params);
//获取
export const getAllCollect = () => get(`collect/selectAll`);
//取消收藏
export const delCollectByUserIdSongId = (userId,songId) => get(`collect/deleteByUserIdSongId?userId=${userId}&songId=${songId}`);

//获取指定用户的收藏
export const getCollectOfUserId = (userId) => get(`collect/selectByUserId?userId=${userId}`);