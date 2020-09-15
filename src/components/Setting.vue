<template>
  <div style="margin-top:50px; text-align:center;">
    <div class="part">
      <p class="title_part">一般设置</p>
      <div style="margin-bottom: 30px;">
        <span style="margin-left:8px;" @click="show_data.notice=true"><Button>公告信息</Button></span>
        <Modal
          v-model="show_data.notice"
          title="发布公告"
          @on-ok="save_notice"
          @on-cancel="cancel">
            <p>Content of dialog</p>
            <p>Content of dialog</p>
            <p>Content of dialog</p>
        </Modal>
        <!--
        <span style="margin-left:8px;"><Button>动态信息</Button></span>
        -->
        <span style="margin-left:8px;"><Button>页脚信息</Button></span>
        <span style="margin-left:8px;"><Button>修改密码</Button></span>
      </div>
      <div class="left_part">
        <p>
          网站名称:
          <Input v-model="set_data.sitename.set_value" placeholder="网站名称" style="width: 301px" />
          <span style="margin-left:2px;"><Button size="small" @click="set_update('sitename')">设置</Button></span>
        </p>
      </div>
      <div class="center_part">
      </div>
      <div class="right_part">
        <p>
          头像完整URL:
          <Input v-model="set_data.avatar_url.set_value" placeholder="头像url" style="width: 300px" />
          <span style="margin-left:2px;"><Button size="small" @click="set_update('avatar_url')">设置</Button></span>
        </p>
      </div>
    </div>
    
    <hr class="part_line" />
    <div class="part">
      <p class="title_part">上传文件设置</p>
      <div class="left_part">
        <p>
          文件大小限制Byte:
          <Input v-model="set_data.upload_file_size.set_value" placeholder="Enter something..." style="width: 300px" />
          <span style="margin-left:2px;"><Button size="small" @click="set_update('upload_file_size')">设置</Button></span>
        </p>
        <p>
          文件mimetype限制:
          <Input v-model="set_data.upload_file_mime.set_value" placeholder="Enter something..." style="width: 300px" />
          <span style="margin-left:2px;"><Button size="small" @click="set_update('upload_file_mime')">设置</Button></span>
        </p>
      </div>
      <div class="center_part">
      </div>
      <div class="right_part">
        <p>
          文件扩展名限制:
          <Input v-model="set_data.upload_file_ext.set_value" placeholder="Enter something..." style="width: 300px" />
          <span style="margin-left:2px;"><Button size="small" @click="set_update('upload_file_ext')">设置</Button></span>
        </p>
      </div>
    </div>
    <hr class="part_line" />
    <div class="part">
      <p class="title_part">安全设置</p>
      <div class="left_part">
        <p>
          登录空闲时间/秒
          <Tooltip content="登录成功以后，多长时间没有操作会自动退出登录。" placement="top" theme="light" max-width="100%">
            <Icon type="ios-help-circle-outline" />
          </Tooltip>:
          <Input v-model="set_data.user_timeout.set_value" placeholder="Enter something..." style="width: 300px" />
          <span style="margin-left:2px;"><Button size="small" @click="set_update('user_timeout')">设置</Button></span>
        </p>
        <p>
          连续登录失败次数
          <Tooltip content="连续登陆失败计数超出设定的值，客户端ip会进黑名单。" placement="top" theme="light" max-width="100%">
            <Icon type="ios-help-circle-outline" />
          </Tooltip>:
          <Input v-model="set_data.login_fail_count.set_value" placeholder="Enter something..." style="width: 300px" />
          <span style="margin-left:2px;"><Button size="small" @click="set_update('login_fail_count')">设置</Button></span>
        </p>
        <p>
          后台管理页面的url前缀:
          <Input v-model="set_data.admin_url.set_value" placeholder="Enter something..." style="width: 300px" />
          <span style="margin-left:2px;"><Button size="small" @click="set_update('admin_url')">设置</Button></span>
        </p>
      </div>
      <div class="center_part">
      </div>
      <div class="right_part">
        <p>
          黑名单封锁时间/秒:
          <Input v-model="set_data.login_blacklist_timeout.set_value" placeholder="黑名单超时时间" style="width: 300px" />
          <span style="margin-left:2px;"><Button size="small" @click="set_update('login_blacklist_timeout')">设置</Button></span>
        </p>
        <p>
          登录失败间隔/秒
          <Tooltip content="两次登录失败的间隔时间低于设置的时间，就会增加失败计数。在下次超出时间或登录成功，计数清零。" placement="top" theme="light" max-width="100%">
            <Icon type="ios-help-circle-outline" />
          </Tooltip>:
          <Input v-model="set_data.login_fail_lasttime.set_value" placeholder="Enter something..." style="width: 300px" />
          <span style="margin-left:2px;"><Button size="small" @click="set_update('login_fail_lasttime')">设置</Button></span>
        </p>
      </div>
    </div>
    <!--
      是否开启websocket，
      发送动态信息，
      静态公告信息，
      页面底部显示的信息，
      头像url，
      后台url，
      昵称,

      上传文件：
      上传文件大小，
      上传文件扩展名，
      上传文件mimetype,


      重新初始化，  清空配置信息， 其他数据不会丢失。 点击确认以后， 删除setting表，之后打开初始化页面进行初始化。

      安全相关:



      -->
  </div>
</template>

<script>
import crypto from 'crypto'
export default {
  name: 'Setting',
  data () {
    return {
      set_data: {
        sitename: {},
        avatar_url: {},
        admin_url: {},
        del_number: {},
        login_blacklist_timeout: {},
        login_fail_count: {},
        login_fail_lasttime: {},
        login_prefix_key_timeout: {},
        upload_file_ext: {},
        upload_file_mime: {},
        upload_file_size: {},
        user_timeout: {},
      },
      show_data: {
        notice: false,
        footer: false,
        passwd: false,
      },
      notice_data: '',
      footer_data: '',
      passwd_data: {
        first: '',
        second: '',
      }
    }
  },
  created: function() {
    document.title = '设置'
    this.get_all_setting()
  },
  methods: {
    save_notice() {

    },
    cancel() {

    },
    set_update(set_name) {
      var data = {
        'set_id': this.set_data[set_name].set_id,
        'set_value': this.set_data[set_name].set_value,
        'set_key': set_name,
      }
      var form_string = Object.values(data).sort().join('_')
      data.hash = this.get_hash(form_string)
      this.hash_cookie()
      this.axios.post('setting/set', data)
      .then(response => {
        if (response.data.success) {
          this.$Message.success({
            background: true,
            content: '修改完成',
            closable: true,
          });
          this.get_update(set_name)
        } else {
          var state = this.auth_invalid(response)
          this.$Message.warning({
            background: true,
            content: '修改失败',
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
    get_update(setname) {
      var data = {set_name: setname}
      var form_string = Object.values(data).sort().join('_')
      data.hash = this.get_hash(form_string)
      this.hash_cookie()
      this.axios.post('setting/get', data)
      .then(response => {
        if (response.data.success) {
          this.set_data[setname].value = response.data.data
        } else {
          var state = this.auth_invalid(response)
          this.$Message.warning({
            background: true,
            content: '设置获取失败',
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
    get_all_setting() {
      this.hash_cookie()
      this.axios.get('setting/get_all')
      .then(response => {
        if (response.data.success) {
          this.$Message.success({
            background: true,
            content: '配置信息获取完成',
            closable: true,
          });
          this.set_data = response.data.data
        } else {
          var state = this.auth_invalid(response)
          this.$Message.warning({
            background: true,
            content: '配置信息获取失败',
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
    request_attach(data, url, msg) {
      var msg_data = {
        get_notice: ['公告获取成功', '公告获取失败'],
        save_notice: ['已保存', '保存失败'],
        get_footer: ['页脚信息获取完成', '页脚信息获取失败'],
        save_footer: ['页脚信息已保存', '页脚信息保存失败'],
        passwd: ['密码修改成功', '密码修改失败'],
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
          if (msg == 'list') {
            this.attach_list_data = response.data.data.list_data
            this.total_attach_num = response.data.data.total_attach_num
          } else if (msg == 'invalid') {
            this.attach_info_data.status = "2"
            this.get_attach_list()

          } else if (msg == 'recover') {
            this.attach_info_data.status = "1"
            this.get_attach_list()

          } else if (msg == 'delete') {
            this.$data.attach_info_data = this.$options.data().attach_info_data
            this.attach_info_show = false
            this.get_attach_list()
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
  }
}
</script>
<style scoped>
  .part {
    margin-top: 30px;
  }
  .left_part {
    float: left;
    width: 48%;
    text-align: right;
  }
  .right_part {
    float: right;
    width: 49%;
    text-align: left;
  }
  .center_part {
    float: right;
    background-color: black;
    width: 2px;
    clear: left；
  }
  .title_part {
    font-size: small;
    letter-spacing: 1px;
    text-shadow: 1px -1px 5px gray;
    margin-bottom: 20px;
  }
  .part_line {
    clear: both;
    border-style:none;
    /*
    border-color: gray;
    width: 65%;
    margin:auto;
    background-color: gray;
    */
  }
  p {
    margin-bottom: 20px;
  }
</style>