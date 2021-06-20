
const song = {
    state:{
        allSongs: [],
        allSingers: [],
        allSongLists: [],
        listOfSongs: [], //当前歌曲列表
        dailySongs: [], //每日推荐
        isPlay: false,//是否播放中
        playStyle: [],
        url: '',//歌曲地址
        id: '',//歌曲id
        playButtonUrl: '#icon-bofang', //播放状态
        playStyleUrl: '#icon-randomPlay', //播放模式
        duration: 0, //音乐时长
        curTime: 0,  //当前音乐播放位置
        changeTime: 0, //指定播放时刻
        title: '', //歌名
        artist: '', //歌手名
        picUrl:'', //歌曲封面地址
        autoNext: true, //自动触发播放下一首
        lyric: [], //未处理的歌词
        tempList:{}, //单个歌单信息或歌手信息
        listIndex: null, //当前歌曲在歌单中的位置
        volume: 50,  //音量默认50
        curPage: 1,//当前页面
    },
    getters:{
        allSongs: state => {
            let allSongs = state.allSongs;
            if(!allSongs){
                JSON.parse(window.sessionStorage.getItem('allSongs')||null);
            }
            return allSongs;
        },
        allSingers: state => {
            let allSingers = state.allSingers;
            if(!allSingers){
                JSON.parse(window.sessionStorage.getItem('allSingers')||null);
            }
            return allSingers;
        },
        allSongLists: state => {
            let allSongLists = state.allSongLists;
            if(!allSongLists){
                JSON.parse(window.sessionStorage.getItem('allSongLists')||null);
            }
            return allSongLists;
        },
        listOfSongs: state => {
            let listOfSongs = state.listOfSongs;
            if(!listOfSongs){
                JSON.parse(window.sessionStorage.getItem('listOfSongs')||null);
            }
            return listOfSongs;
        },
        dailySongs: state => {
            let dailySongs = state.dailySongs;
            if(!dailySongs){
                JSON.parse(window.sessionStorage.getItem('dailySongs')||null);
            }
            return dailySongs;
        },
        isPlay: state => {
            let isPlay = state.isPlay;
            if(!isPlay){
                isPlay = JSON.parse(window.sessionStorage.getItem('isPlay')||null);
            }
            return isPlay;
        },
        playStyle: state => {
            let playStyle = state.playStyle;
            if(!playStyle){
                playStyle = JSON.parse(window.sessionStorage.getItem('playStyle')||null);
            }
            return playStyle;
        },
        url: state => {
            let url = state.url;
            if(!url){
                url = JSON.parse(window.sessionStorage.getItem('url')||null);
            }
            return url;
        },
        id: state => {
            let id = state.id;
            if(!id){
                id = JSON.parse(window.sessionStorage.getItem('id')||null);
            }
            return id;
        },
        playButtonUrl: state => {
            let playButtonUrl = state.playButtonUrl;
            if(!playButtonUrl){
                playButtonUrl = JSON.parse(window.sessionStorage.getItem('playButtonUrl')||null);
            }
            return playButtonUrl;
        },
        playStyleUrl: state => {
            let playStyleUrl = state.playStyleUrl;
            if(!playStyleUrl){
                playStyleUrl = JSON.parse(window.sessionStorage.getItem('playStyleUrl')||null);
            }
            return playStyleUrl;
        },
        duration: state => {
            let duration = state.duration;
            if(!duration){
                duration = JSON.parse(window.sessionStorage.getItem('duration')||null);
            }
            return duration;
        },
        curTime: state => {
            let curTime = state.curTime;
            if(!curTime){
                curTime = JSON.parse(window.sessionStorage.getItem('curTime')||null);
            }
            return curTime;
        },
        changeTime: state => {
            let changeTime = state.changeTime;
            if(!changeTime){
                changeTime = JSON.parse(window.sessionStorage.getItem('changeTime')||null);
            }
            return changeTime;
        },
        title: state => {
            let title = state.title;
            if(!title){
                title = JSON.parse(window.sessionStorage.getItem('title')||null);
            }
            return title;
        },
        artist: state => {
            let artist = state.artist;
            if(!artist){
                artist = JSON.parse(window.sessionStorage.getItem('artist')||null);
            }
            return artist;
        },
        picUrl: state => {
            let picUrl = state.picUrl;
            if(!picUrl){
                picUrl = JSON.parse(window.sessionStorage.getItem('picUrl')||null);
            }
            return picUrl;
        },
        autoNext: state => {
            let autoNext = state.autoNext;
            if(!autoNext){
                autoNext = JSON.parse(window.sessionStorage.getItem('autoNext')||null);
            }
            return autoNext;
        },
        lyric: state => {
            let lyric = state.lyric;
            if(!lyric){
                lyric = JSON.parse(window.sessionStorage.getItem('lyric')||null);
            }
            return lyric;
        },
        tempList: state => {
            let tempList = state.tempList;
            if(!tempList){
                tempList = JSON.parse(window.sessionStorage.getItem('tempList')||null);
            }
            return tempList;
        },
        listIndex: state => {
            let listIndex = state.listIndex;
            if(!listIndex){
                listIndex = JSON.parse(window.sessionStorage.getItem('listIndex')||null);
            }
            return listIndex;
        },
        volume: state => {
            let volume = state.volume;
            if(!volume){
                volume = JSON.parse(window.sessionStorage.getItem('volume')||null);
            }
            return volume;
        },
        curPage: state => {
            let curPage = state.curPage;
            if(!curPage){
                curPage = JSON.parse(window.sessionStorage.getItem('curPage')||null);
            }
            return curPage;
        }
    },
    mutations:{
        setAllSongs: (state,allSongs) => {
            state.allSongs = allSongs;
            window.sessionStorage.setItem('allSongs',JSON.stringify(allSongs));
        },
        setAllSingers: (state,allSingers) => {
            state.allSingers = allSingers;
            window.sessionStorage.setItem('allSingers',JSON.stringify(allSingers));
        },
        setAllSongLists: (state,allSongLists) => {
            state.allSongLists = allSongLists;
            window.sessionStorage.setItem('allSongLists',JSON.stringify(allSongLists));
        },
        setListOfSongs: (state,listOfSongs) => {
            state.listOfSongs = listOfSongs;
            window.sessionStorage.setItem('listOfSongs',JSON.stringify(listOfSongs));
        },
        setDailySongs: (state,dailySongs) => {
            state.dailySongs = dailySongs;
            window.sessionStorage.setItem('dailySongs',JSON.stringify(dailySongs));
        },
        setIsPlay: (state,isPlay) => {
            state.isPlay = isPlay;
            window.sessionStorage.setItem('isPlay',JSON.stringify(isPlay));
        },
        setPlayStyle: (state,playStyle) => {
            state.playStyle = playStyle;
            window.sessionStorage.setItem('playStyle',JSON.stringify(playStyle));
        },
        setUrl: (state,url) => {
            state.url = url;
            window.sessionStorage.setItem('url',JSON.stringify(url));
        },
        setId: (state,id) => {
            state.id = id;
            window.sessionStorage.setItem('id',JSON.stringify(id));
        },
        setPlayButtonUrl: (state,playButtonUrl) => {
            state.playButtonUrl = playButtonUrl;
            window.sessionStorage.setItem('playButtonUrl',JSON.stringify(playButtonUrl));
        },
        setPlayStyleUrl: (state,playStyleUrl) => {
            state.playStyleUrl = playStyleUrl;
            window.sessionStorage.setItem('playStyleUrl',JSON.stringify(playStyleUrl));
        },
        setDuration: (state,duration) => {
            state.duration = duration;
            window.sessionStorage.setItem('duration',JSON.stringify(duration));
        },
        setCurTime: (state,curTime) => {
            state.curTime = curTime;
            window.sessionStorage.setItem('curTime',JSON.stringify(curTime));
        },
        setChangeTime: (state,changeTime) => {
            state.changeTime = changeTime;
            window.sessionStorage.setItem('changeTime',JSON.stringify(changeTime));
        },
        setTitle: (state,title) => {
            state.title = title;
            window.sessionStorage.setItem('title',JSON.stringify(title));
        },
        setArtist: (state,artist) => {
            state.artist = artist;
            window.sessionStorage.setItem('artist',JSON.stringify(artist));
        },
        setPicUrl: (state,picUrl) => {
            state.picUrl = picUrl;
            window.sessionStorage.setItem('picUrl',JSON.stringify(picUrl));
        },
        setAutoNext: (state,autoNext) => {
            state.autoNext = autoNext;
            window.sessionStorage.setItem('autoNext',JSON.stringify(autoNext));
        },
        setLyric: (state,lyric) => {
            state.lyric = lyric;
            window.sessionStorage.setItem('lyric',JSON.stringify(lyric));
        },
        setTempList: (state,tempList) => {
            state.tempList = tempList;
            window.sessionStorage.setItem('tempList',JSON.stringify(tempList));
        },
        setListIndex: (state,listIndex) => {
            state.listIndex = listIndex;
            window.sessionStorage.setItem('listIndex',JSON.stringify(listIndex));
        },
        setVolume: (state,volume) => {
            state.volume = volume;
            window.sessionStorage.setItem('volume',JSON.stringify(volume));
        },
        setCurPage: (state,curPage) => {
            state.curPage = curPage;
            window.sessionStorage.setItem('curPage',JSON.stringify(curPage));
        },
    }
}

export default song