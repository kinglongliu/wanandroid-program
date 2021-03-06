//index.js
//获取应用实例
import api from "../../api/api.js";
const app = getApp()

Page({
  data: {
    bannerList:[],
    articleList:[],
    page:1,
    pageCount:0,
    isLoadingMore:true
  },

  onLoad() {
    api.getHomeBanner()
      .then(res => {
        console.log(res.data)
        this.setData({
          bannerList: res.data
        })
      })
      .catch(e => {

      })

    this.getArticle(this.data.page)  
  },

  getArticle(page) {
    api.getHomeArticle(page - 1)
      .then(res => {
        console.log(res.data)
        for (let item of res.data.datas) {
          item.headTetx = item.author.substring(0, 1)
        }
        wx.stopPullDownRefresh()
        this.setData({
          articleList: this.data.articleList.concat(res.data.datas),
          page: page,
          isLoadingMore: false,
          pageCount: res.data.pageCount,
        })
      })
      .catch(e => {

      })
  },

  searchClick() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  onItemClick(event){
    wx.navigateTo({
      url: '/pages/web/web?url='+event.currentTarget.dataset.url,
    })
  },

  onBannerClick(event){
    wx.navigateTo({
      url:"/pages/web/web?url="+event.currentTarget.dataset.url
    })
  },

  collect(event){
    const id = event.currentTarget.dataset.id
    const zan = event.currentTarget.dataset.zan
    const index = event.currentTarget.dataset.index
    if(app.isLogin()){
      
      if(zan){
        api.uncollect(id).then(
          res=>{
            this.data.articleList[index].collect = false
            this.setData({
              articleList:this.data.articleList
            })
            wx.showToast({
              title: '取消收藏成功',
            })
          }
        ).catch(
          e=>{
            console.log(e.errorMsg)
          }
        )

      }else{
        api.collect(id).then(
          res => {
            this.data.articleList[index].collect = true
            this.setData({
              articleList: this.data.articleList
            })
            wx.showToast({
              title: '收藏成功',
            })
          }
        ).catch(
          e=>{
            console.log(e.errorMsg)
          }
        )
      }
    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  //下拉刷新
  onPullDownRefresh(){
    this.setData({
      page: 1,
      pageCount: 0,
      isLoadingMore: false
    })
    this.onLoad()
    wx.stopPullDownRefresh()
  },

  //加载更多
  onReachBottom() {
    if (this.data.pageCount <= this.data.page || this.data.isLoadingMore) {
      return false;
    }
    this.setData({
      isLoadingMore: true,
    })
    this.getArticle(this.data.page + 1)
  },
 
})


