<template>
  <div style="position:absolute;left:20%;right:20%;top:80px;text-align:center">
    <p class="title_part">上传文件设置</p>
    <div class="left_part">
      <p>
        文件大小限制Byte:
      <Input placeholder="Enter something..." style="width: 300px" />
      <Button size="small">设置</Button>
      </p>
      <p>
        文件mimetype限制:
      <Input placeholder="Enter something..." style="width: 300px" />
      <Button size="small">设置</Button>
      </p>
    </div>
    <div class="center_part">
    </div>
    <div class="right_part">
      <p>
        文件扩展名限制:
      <Input placeholder="Enter something..." style="width: 300px" />
      <Button size="small">设置</Button>
      </p>
    <p>
      密码修改:
      <Input type="password" password placeholder="Enter something..." style="width: 300px" />
      <Button size="small">设置</Button>
    </p>
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
  .left_part {
    position: relative;
    left: 2px;
    right: 2px;
    width: 48%;
    text-align: right;
  }
  .right_part {
    position: relative;
    left: 2px;
    right: 2px;
    width: 48%;
    text-align: left;
  }
  .center_part {
    background-color: black;
    width: 2px;
    clear: left；
  }
  .title_part {
    font-size: small;
    letter-spacing: 1px;
    text-shadow: 3px -3px 6px gray;
    margin-bottom: 20px;
  }
  p {
    margin-bottom: 20px;
  }
</style>