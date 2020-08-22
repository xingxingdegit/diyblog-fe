<template>
  <div>
    <Table :columns="post_list_columns" :data="post_list_data"></Table>
  </div>
</template>

<script>
import crypto from 'crypto'

export default {
  name: 'post-show',
  data () {
    return {
      post_list_columns: [
        {title: 'Title', key: 'title'}, 
        {title: '状态', key: 'status_str'}, 
        {title: '分类', key: 'classes_str'}, 
        {title: '标签', key: 'tags_str'}, 
        {title: '发布时间', key: 'create_time'}, 
        {title: '操作', key: 'op'}
      ],
      post_list_data: [],
      page_num: 1,
      post_num_per_page: 10,
    }
  },
  created: function() {
    this.get_post_list()
  },
  methods: {
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
    get_post_list() {
      var data = {page_num: this.page_num, post_num_per_page: this.post_num_per_page}
      var form_string = [data.page_num, data.post_num_per_page].sort().join('_')
      data.hash = this.get_hash(form_string)
      this.hash_cookie()
      this.axios.post('post/get_list', data)
      .then(response => {
        if (response.data.success) {
          this.post_list_data = response.data.data
          this.$Message.success({
            background: true,
            content: '列表获取完成'
          });
        } else {
          var state = this.auth_invalid(response)
          this.$Message.warning({
            background: true,
            content: '列表获取失败',
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
    get_args() {
      var args = document.location.search
      var args_obj = new Object()
      if (args) {
        args = args.slice(1).split('&')
        for (var i=0;i<args.length;i++) {
          var key_value = args[i].split('=')
          args_obj[key_value[0]] = key_value[1]
        }
        return args_obj
      } else {
        return false
      }
    },
    get_hash(string) {
      var url = document.location.host
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