<template>
  <div class="layout">
    <Layout>
      <Header style="position: static, width: 100%;z-index: 1000;">
        <Menu mode="horizontal" @on-select="menu_decide" theme="dark" active-name="1">
          <div class="head_left_part">Dashboard</div>
          <div class="head_right_part"><span @click="logout" style="cursor: pointer;">注销</span> | {{username}}</div>
          <div class="layout-nav">
            <MenuItem name="Dashboard">
                <Icon type="md-speedometer" />
                仪表盘
            </MenuItem>
            <Submenu name="posts">
                <template slot="title">
                    <Icon type="ios-create" />
                    文章
                </template>
                <MenuItem name="PostHandler">写文章</MenuItem>
                <MenuItem name="PostShow">所有文章</MenuItem>
            </Submenu>
            <MenuItem name="Attach">
                <Icon type="md-attach" />
                附件
            </MenuItem>
            <Submenu name="ClassTags">
                <template slot="title">
                    <Icon type="md-albums" />
                    分类
                </template>
                <MenuItem name="Class">分类</MenuItem>
                <MenuItem name="Tags">标签</MenuItem>
            </Submenu>
            <MenuItem name="Setting">
                <Icon type="ios-construct" />
                设置
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Content style="background: #f7f7f7; minHeight: 500px; padding: 0 5%; margin-bottom: 50px;">
        <component :reset_data="reset_data" id="content" @put_event="put_event" v-bind:is="currentComponent" />
      </Content>
      <Footer class="layout-footer-center">
        Hello World
      </Footer>
    </Layout>
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue'
import PostHandler from './components/PostHandler.vue'
import PostShow from './components/PostShow.vue'
import Attach from './components/Attach.vue'
import Setting from './components/Setting.vue'
import Class from './components/Class.vue'
import Tags from './components/Tags.vue'

import crypto from 'crypto'

export default {
  name: 'app',
  data () {
    return {
      currentComponent: '',
      reset_data: 0,
      username: '',
    }
  },
  components: {
    Dashboard,
    PostHandler,
    PostShow,
    Attach,
    Setting,
    Class,
    Tags,
  },
  created: function () {
    var component = document.location.hash.split('/')[0] || '#Dashboard'
    this.currentComponent = component.slice(1)
    this.get_username()
  },
  methods: {
    menu_decide: function(menuName) {
      if (this.currentComponent == 'PostHandler') {
        this.$Modal.confirm({
          title: '确认离开吗?',
          content: '<p style="color: red"> 注意：离开会使未保存的文档丢失!</p>',
          okText: '离开',
          onOk: () => {
            document.location.hash = menuName
            this.currentComponent = menuName
            this.reset_component(menuName)
          },
          onCancel: () => {
            this.$Message.info('已取消');
          }
        });
      } else {
        document.location.hash = menuName
        this.currentComponent = menuName
        this.reset_component(menuName)
      }
    },
    put_event: function(component_name) {
      this.currentComponent = component_name
      this.reset_component(component_name)
    },
    reset_component: function(com_name) {
      if (com_name == this.currentComponent) {
        this.reset_data += 1
      }
    },
    get_username: function() {
      var cookie = document.cookie.split(';')
      var cookie_list = new Array()
      for (var i=0; i < cookie.length; i++) {
        var cookie_simple = cookie[i].trim().split('=')
        if (cookie_simple[0] == 'username') {
          this.username = cookie_simple[1]
          break
        }
      }
    },
    logout: function() {
      this.$Modal.confirm({
        title: '确认注销',
        content: '真的注销吗?',
        okText: '注销',
        onOk: () => {
          var data = {'username': this.username}
          this.request_app(data, 'logout', 'logout')
        },
        onCancel: () => {
          this.$Message.info('已取消');
        }
      });
    },
    request_app(data, url, msg) {
      var msg_data = {
        logout: ['已注销', '注销失败'],
      }
      var form_string = Object.values(data).sort().join('_')
      data.hash = this.get_hash(form_string)
      this.hash_cookie()
      this.axios.post(url, data)
      .then(response => {
        if (response.data.success) {
          this.$Message.success({
            background: true,
            content: msg_data[msg][0],
            closable: true,
          });
          if (msg == 'logout') {
            setTimeout(() => {
            this.$Modal.confirm({
              title: '是否跳转',
              content: '注销成功，是否跳转登录页面',
              okText: '跳转',
              onOk: () => {
                this.axios.get('get_url?type=login')
                .then(response => {
                  document.location.pathname = response.data.data
                })
              },
              onCancel: () => {
                this.$Message.info('取消跳转');
              }
            });
            }, 500);
          }
        } else {
          var state = this.auth_invalid(response)
          this.$Message.warning({
            background: true,
            content: msg_data[msg][1],
            duration: 5,
            closable: true,
          });
        }
      })
      .catch(error => {
        console.log(error)
          this.$Message.error({
            background: true,
            content: '请求异常,请检查网络或后端服务',
            duration: 10,
            closable: true,
          });
      })
    },
    auth_invalid(response) {
      if (response.data.data == 'auth_invalid') {
        this.$Modal.confirm({
          title: '是否跳转',
          content: '登录信息失效，是否跳转登录页面',
          okText: '跳转',
          onOk: () => {
            this.axios.get('get_url?type=login')
            .then(response => {
              document.location.pathname = response.data.data
            })
          },
          onCancel: () => {
            this.$Message.info('取消跳转');
          }
        });
      }
    },
    get_hash(string) {
      var url = document.location.origin
      var time_key = Math.floor(Date.now() / 100000)
      var hmac = crypto.createHmac('sha256', url + '_' + String(time_key)); 
      hmac.update(string)
      var hash = hmac.digest('hex')
//      var hash = hmac.digest('base64')
      return hash
    },
    hash_cookie() {
      var cookie = document.cookie.split(';')
      var cookie_list = new Array()
      for (var i=0; i < cookie.length; i++) {
        var cookie_simple = cookie[i].trim().split('=')
        if (cookie_simple[0] == 'hash') {
          continue
        }
        cookie_list.push(cookie_simple[1])
      }
      var cookie_str = cookie_list.sort().join('_')
      var cookie_hash = this.get_hash(cookie_str)
      document.cookie = 'hash=' + cookie_hash
    },
  }
}
</script>


<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-logo{
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }
    .layout-nav{
        width: 600px;
        margin: 0 auto;
    }
    .layout-footer-center{
        text-align: center;
    }
    .head_left_part {
      color: white;
      float: left;
    }
    .head_right_part {
      color: white;
      float: right;
    }
</style>
