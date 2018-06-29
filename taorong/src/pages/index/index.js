import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../actions/counter'

import './index.less'

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add() {
    dispatch(add())
  },
  dec() {
    dispatch(minus())
  },
  asyncAdd() {
    dispatch(asyncAdd())
  }
}))
export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  state = { 
  }

  componentWillMount() {console.log('page willmount')}
  componentDidMount() {console.log('page didmount');}
  componentWillReceiveProps(nextProps) { console.log(this.props, nextProps);}
  componentWillUnmount() { }
  componentDidShow() { } 
  componentDidHide() {}

  goto = () => {
    Taro.navigateTo({
      url: '/pages/index2/index?sd=1'
    })
  }

  render() {
   
    return (
      <View className='index'>
         首页
      </View> 
    )
  }
}