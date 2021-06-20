
const configure = {
    state:{
        HOST: "http://www.huole.xyz:9527",
        // HOST: 'http://10.206.154.159:9528',
        // HOST: 'http://8.136.154.67:80',
        activeName: '',         //当前选中菜单名
        showAside: false,       //是否显示播放列表
        loginIn: false,           //用户是否已经登录
        isActive: false,//当前歌曲是否已收藏
        isRandom: false,//是否随机播放
        isSingle: false,//是否单曲循环
    },
    getters:{
        activeName: state => {
            let activeName = state.activeName
            if(!activeName){
                activeName = JSON.parse(window.sessionStorage.getItem('activeName'))
            }
            return activeName
        },
        showAside: state => {
            let showAside = state.showAside
            if(!showAside){
                showAside = JSON.parse(window.sessionStorage.getItem('showAside'))
            }
            return showAside
        },
        showSongList: state => {
            let showSongList = state.showSongList
            if(!showSongList){
                showSongList = JSON.parse(window.sessionStorage.getItem('showSongList'))
            }
            return showSongList
        },
        loginIn: state => {
            let loginIn = state.loginIn
            if(!loginIn){
                loginIn = JSON.parse(window.sessionStorage.getItem('loginIn'))
            }
            return loginIn
        },
        isActive: state => {
            let isActive = state.isActive
            if(!isActive){
                isActive = JSON.parse(window.sessionStorage.getItem('isActive'))
            }
            return isActive
        },
        isRandom: state => {
            let isRandom = state.isRandom
            if(!isRandom){
                isRandom = JSON.parse(window.sessionStorage.getItem('isRandom'))
            }
            return isRandom
        },
        isSingle: state => {
            let isSingle = state.isSingle
            if(!isSingle){
                isSingle = JSON.parse(window.sessionStorage.getItem('isSingle'))
            }
            return isSingle
        }
        
    },
    mutations:{
        setActiveName: (state,activeName) => {
            state.activeName = activeName
            window.sessionStorage.setItem('activeName',JSON.stringify(activeName))
        },
        setShowAside: (state,showAside) => {
            state.showAside = showAside
            window.sessionStorage.setItem('showAside',JSON.stringify(showAside))
        },
        setShowSongList: (state,showSongList) => {
            state.showSongList = showSongList
            window.sessionStorage.setItem('showSongList',JSON.stringify(showSongList))
        },
        setLoginIn: (state,loginIn) => {
            state.loginIn = loginIn
            window.sessionStorage.setItem('loginIn',JSON.stringify(loginIn))
        },
        setIsActive: (state,isActive) => {
            state.isActive = isActive
            window.sessionStorage.setItem('isActive',JSON.stringify(isActive))
        },
        setIsRandom: (state,isRandom) => {
            state.isRandom = isRandom
            window.sessionStorage.setItem('isRandom',JSON.stringify(isRandom))
        },
        setIsSingle: (state,isSingle) => {
            state.isSingle = isSingle
            window.sessionStorage.setItem('isSingle',JSON.stringify(isSingle))
        },
    }
}

export default configure