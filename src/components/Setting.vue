<template>
  <div style="margin-top:50px; text-align:center;">
    <div class="part">
      <p class="title_part">一般设置</p>
      <div style="margin-bottom: 30px;">
        <span style="margin-left:8px;"><Button>公告信息</Button></span>
        <!--
        <span style="margin-left:8px;"><Button>动态信息</Button></span>
        -->
        <span style="margin-left:8px;"><Button>页脚设置</Button></span>
        <span style="margin-left:8px;"><Button>修改密码</Button></span>
        <span style="margin-left:8px;"><Button>默认设置</Button></span>
      </div>
      <div class="left_part">
        <p>
          网站名称:
          <Input placeholder="Enter something..." style="width: 301px" />
          <span style="margin-left:2px;"><Button size="small">设置</Button></span>
        </p>
      </div>
      <div class="center_part">
      </div>
      <div class="right_part">
        <p>
          头像URL:
          <Input placeholder="Enter something..." style="width: 300px" />
          <span style="margin-left:2px;"><Button size="small">设置</Button></span>
        </p>
      </div>
    </div>
    
    <hr class="part_line" />
    <div class="part">
      <p class="title_part">上传文件设置</p>
      <div class="left_part">
        <p>
          文件大小限制Byte:
          <Input placeholder="Enter something..." style="width: 300px" />
          <span style="margin-left:2px;"><Button size="small">设置</Button></span>
        </p>
        <p>
          文件mimetype限制:
          <Input placeholder="Enter something..." style="width: 300px" />
          <span style="margin-left:2px;"><Button size="small">设置</Button></span>
        </p>
      </div>
      <div class="center_part">
      </div>
      <div class="right_part">
        <p>
          文件扩展名限制:
          <Input placeholder="Enter something..." style="width: 300px" />
          <span style="margin-left:2px;"><Button size="small">设置</Button></span>
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
          <Input placeholder="Enter something..." style="width: 300px" />
          <span style="margin-left:2px;"><Button size="small">设置</Button></span>
        </p>
        <p>
          连续登录失败次数
          <Tooltip content="连续登陆失败计数超出设定的值，客户端ip会进黑名单。" placement="top" theme="light" max-width="100%">
            <Icon type="ios-help-circle-outline" />
          </Tooltip>:
          <Input placeholder="Enter something..." style="width: 300px" />
          <span style="margin-left:2px;"><Button size="small">设置</Button></span>
        </p>
        <p>
          后台管理页面的url前缀:
          <Input placeholder="Enter something..." style="width: 300px" />
          <span style="margin-left:2px;"><Button size="small">设置</Button></span>
        </p>
      </div>
      <div class="center_part">
      </div>
      <div class="right_part">
        <p>
          黑名单封锁时间/秒:
          <Input placeholder="Enter something..." style="width: 300px" />
          <span style="margin-left:2px;"><Button size="small">设置</Button></span>
        </p>
        <p>
          登录失败间隔/秒
          <Tooltip content="两次登录失败的间隔时间低于设置的时间，就会增加失败计数。在下次超出时间或登录成功，计数清零。" placement="top" theme="light" max-width="100%">
            <Icon type="ios-help-circle-outline" />
          </Tooltip>:
          <Input placeholder="Enter something..." style="width: 300px" />
          <span style="margin-left:2px;"><Button size="small">设置</Button></span>
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

export default {
  name: 'Setting',
  data () {
    return {
      login_key: 'abc',
      post_title: '',
    }
  },
  created: function() {
    document.title = '设置'
  },
  methods: {
    check_title: function() {
      this.axios.get('getkey')
        .then(response => {
          this.login_key = response.data.data
        })
        .catch(error => {
          console.log(error)
        })
    }
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