var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Amount:0,
    CouponType: 0,
    DiscountType: 0,
    type: 1,
    carType:"",
    current: '',
    cardId:0,
    Discount: 0,//优惠
    discountLabel: "请选择",
    add_show: false,
    Totalfee:'',
    Coupon:'',
    config: [
      {
        src: '入门级',
        price: "100",
        value: "100点",
        single: "(1.00元/T)",
        A9: "200元/ASIN",
        auto: "200元/周期",
        gk: "4.00元/ASIN",
        type: 1
      },
      {
        src: '基础级',
        price: "300",
        value: "350点",
        single: "(0.86元/T)",
        A9: "172元/ASIN",
        auto: "172元/周期",
        gk: "3.44元/ASIN",
        type: 2
      },
      {
        src: '标准级',

        price: "600",
        value: "800点",
        single: "(0.75元/T)",
        A9: "150元/ASIN",
        auto: "150元/周期",
        gk: "3.00元/ASIN",
        type: 3
      },
      {
        src: '专业级',
        price: "1200",
        value: "2000点",
        single: "(0.60元/T)",
        A9: "120/ASIN",
        auto: "120元/周期",
        gk: "2.4元/ASIN",
        type: 4
      },
      {
        src: '企业级',
        price: "2400",
        value: "3000点",
        single: "(0.48元/T)",
        A9: "96元/ASIN",
        auto: "96元/周期",
        gk: "1.72元/ASIN",
        type: 5
      }

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
   // console.log(options.type);
    var now = new Date();

    var year = now.getFullYear();       //年  
    var month = now.getMonth() + 1;     //月  
    var day = now.getDate();            //日  

    var hh = now.getHours();            //时  
    var mm = now.getMinutes();          //分  
    var ss = now.getSeconds();  
    let current = that.data.config.filter((item) => item.type == options.type);
    if (options.type) {
      that.setData({
        current: current[0],
        Totalfee: current[0].price,
        now: `${year}/${month}/${day} ${hh}:${mm}:${ss}`
      })
    }
     
  },
  onShow() {
    let that = this;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
   // console.log(currPage.data)
    // that.setData({//将携带的参数赋值
    //   address: currPage.data.item
    // });
    let carType='';
   
    if (currPage.data.DiscountType.toString()==='1'){
      carType ="折扣券";
      that.setData({
        CouponType:2,
        Totalfee: that.data.current.price * that.data.Discount
      })
    } else if (currPage.data.DiscountType.toString() === '2'){
      carType = "满减券";
      that.setData({
        CouponType:2,
        Totalfee: that.data.current.price- that.data.Discount
      })
    } else if (currPage.data.DiscountType.toString() === '3'){
      carType ="抵扣券";
      that.setData({
        CouponType:2,
        Totalfee: that.data.current.price - that.data.Discount
      })
    }
    that.setData({
      carType: carType,
      Coupon:'',
       
    })

  },
  selectDiscount: function () {
    wx.navigateTo({
      url: `/pages/coupon/index?type=pay&value=${this.data.current.price}`
    })
  },
  changeShow: function () {
    let that = this;
    that.setData({
      add_show: !that.data.add_show
    })
  },
  // 输入优惠券代码
  changename: function (e) {
    let value = e.detail.value;
    let that = this;
    that.setData({
      Coupon: value
    })
  },
  scan:function(){
    let that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res.result);
        that.setData({
          Coupon: res.result
        })
      }
    })
  },
  // 确认验证码
  sure_add: function () {
    let that = this;
    let fn = msg => {
     // console.log(msg)
      let res=JSON.parse(msg.data.d)
      if(res.State==1){
       that.setData({
         Totalfee: that.data.current.price *(res.ReturnInfo/10),
         add_show: false,
         carType:"折扣券",
         CouponType:1,
         DiscountID:0,
         Discount:res.ReturnInfo/10,
         DiscountType:1
       })
      }else{
        wx.showModal({
          title: '提示',
          content: res.ReturnInfo,
        })
      }
    }
    app.ajax('/CouponValid', { textCoupon: that.data.Coupon, UserID:app.globalData.PKID }, fn)
  },
  GetPayImg:function(){
    let that=this;
    let data={
      UserID: app.globalData.PKID,//
      Openid: app.globalData.openId,
      AllTotalfee: that.data.current.price-0,
      CouponType: that.data.CouponType,//1优惠券 2用户绑定 0 无
      Coupon: that.data.Coupon,//优惠券代码
      DiscountID: that.data.cardId,
      Discount: that.data.Discount,
      DiscountType: that.data.DiscountType,
      Totalfee: that.data.Totalfee-0, //优惠后金额
      Amount:that.data.Amount,
    }
    let fn=msg=>{
     // console.log();
      let res = JSON.parse(msg.data.d);
      if (res.State===1){
        let returnInf = JSON.parse(res.ReturnInfo);
        wx.requestPayment({
          'timeStamp': returnInf.timeStamp,
          'nonceStr': returnInf.nonceStr,
          'package': returnInf.package,
          'signType': 'MD5',
          'paySign': returnInf.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              mask: false
            })
            let fn = msg => {
              let ret = JSON.parse(msg.data.d);
              app.initUserInfo(JSON.parse(ret.ReturnInfo));
              app.initUserData(ret.ReturnInfo);
              wx.switchTab({
                url: '/pages/usercenter/index',
              })
            }
            app.ajax('/GetUserInfo', { Openid: app.globalData.openId }, fn)
          
          },
          'fail': function (res) {
            wx.showModal({
              title: '提示',
              content: '支付失败',
              showCancel: false
               
            })
          }
        })

      }else{
        wx.showToast({
          title:res.ReturnInfo,
          icon:"none"
        })
      }
    }
    app.ajax('/WXPay', data, fn)
  },
 

})