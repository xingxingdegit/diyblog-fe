<template>
  <div>
    <header style="margin: 20px 50px;">
      <p>
        <Input v-model="upload_data.search_keyword" style="width:20%" placeholder="关键字" />
        <Select v-model="upload_data.search_status" style="width:20%" placeholder="文章状态">
          <Option value="1">已发布</Option>
          <Option value="2">草稿</Option>
          <Option value="3">已删除</Option>
        </Select>
        <Select v-model="upload_data.search_class" style="width: 20%" placeholder="分类">
          <Option v-for="item in class_list_data" :value="item.id" :key="item.id">{{ item.classname }}</Option>
        </Select>
        <Button type="primary" shape="circle" icon="ios-search" @click="search_post_list()" style="margin-left: 10px;">查询</Button>
        <Button type="primary" shape="circle" icon="md-refresh" @click="reset_search()" style="margin-left: 10px;">重置</Button>
      </p>
      <Button type="primary" ghost @click="create_post()" style="margin-top: 10px;">写文章</Button>
    </header>
    <section>
      <Table stripe border :columns="post_list_columns" :data="post_list_data">
        <template slot-scope="{ row }" slot="action">
            <Button type="primary" size="small" class="post_button" @click="edit_post(row.id)">编辑</Button>
            <template v-if="row.status != 3">
              <Button type="primary" size="small" class="post_button" @click="remove_post(row.id)">回收站</Button>
              <Button v-if="row.status == 1" class="post_button" type="error" size="small" @click="cancel_public(row.id)">取消发布</Button>
              <Button v-else type="primary" class="post_button" size="small" @click="public_post(row.id)">发布</Button>
            </template>
            <template v-else>
              <Button type="primary" class="post_button" size="small" @click="cancel_del(row.id)">恢复</Button>
              <Button type="warning" class="post_button" size="small" @click="del_post(row.id)">彻底删除</Button>
            </template>
        </template>

      </Table>
    </section>
    <footer>
    </footer>
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
        {title: '访问次数', key: 'visits'}, 
        {title: '发布时间', key: 'create_time'}, 
        {title: '操作', slot: 'action'}
      ],
      post_list_data: [],
      upload_data: {
        page_num: 1,
        post_num_per_page: 10,
        search_on: false,
        search_keyword: '',
        search_status: 0,
        search_class: 0,
      },
      class_list_data: [],
    }
  },
  created: function() {
    this.get_post_list()
    this.get_class_list()
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
    create_post() {
      document.location.hash = 'PostHandler/Create'
      this.$emit('put_event', 'PostHandler')
    },
    edit_post(post_id) {
      document.location.hash = 'PostHandler/Edit?id=' + post_id
      this.$emit('put_event', 'PostHandler')
    },
    search_post_list() {
      this.upload_data.search_on = true
      this.get_post_list()
    },
    reset_search() {
      this.upload_data.search_on = false
      this.upload_data.search_keyword = ''
      this.upload_data.search_status = 0
      this.upload_data.search_class = 0
    },
    get_post_list() {
      var data = this.upload_data
      var form_string = Object.values(data).sort().join('_')
      data.hash = this.get_hash(form_string)
      this.hash_cookie()
      this.axios.post('post/get_list', data)
      .then(response => {
        if (response.data.success) {
          this.post_list_data = response.data.data
          console.log(this.post_list_data)
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
    get_class_list() {
      this.axios.get('/class/list')
        .then(response => {
          if (response.data.success) {
            this.class_list_data = response.data.data
          }
        })
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
<style scoped>
  .post_button {
    margin-left: 2px;
    margin-right: 2px;
  }
</style>