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
        <Select v-model="upload_data.search_class" filterable style="width: 20%" placeholder="分类">
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
              <Button type="primary" class="post_button" size="small" @click="cancel_remove(row.id)">恢复</Button>
              <Poptip
                confirm
                transfer
                title="确定删除吗?"
                width="80px"
                @on-ok="del_post(row.id)"
                @on-cancel="cancel_delete">
                  <Button type="warning" class="post_button" size="small">彻底删除</Button>
              </Poptip>
            </template>
        </template>
      </Table>
    </section>
    <section style="text-align: center; margin-top: 30px;">
      <Page :total="total_post_num" :current="upload_data.page_num" :page-size="upload_data.post_num_per_page" :page-size-opts="page_size_opts"
            transfer show-total show-sizer @on-change="page_num_change" @on-page-size-change="page_size_change" />
    </section>
    <footer>
    </footer>
    <Published
      :pub_show="pub_value.show"
      :reset_publish="reset_data"
      :post_id="publish_data.post_id"
      @pub-show="pub_show_change"
      @publish-post="publish_post"
     />

  </div>
</template>

<script>
import crypto from 'crypto'
import Published from './Published.vue'

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
        {title: '操作', slot: 'action', width: 250}
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
      pub_value: {
        show: false,
      },
      publish_data: {
        post_id: 0,

      },
      reset_data: 0,
      total_post_num: 0,
      class_list_data: [],
      page_size_opts: [5, 10, 20, 30],
    }
  },
  components: {
    Published,
  },
  created: function() {
    document.title = '文章列表'
    this.get_post_list()
    this.get_class_list()
  },
  methods: {
    cancel_public(post_id) {
      var data = {post_id: post_id}
      var form_string = Object.values(data).sort().join('_')
      data.hash = this.get_hash(form_string)
      this.hash_cookie()
      this.axios.post('post/publish_cancel', data)
      .then(response => {
        if ( response.data.success ) {
          this.$Message['success']({
            background: true,
            content: '取消发布成功',
            duration: 5,
            closable: true,
          })
          this.get_post_list()
        } else {
          var state = this.auth_invalid(response)
          this.$Message['warning']({
            background: true,
            content: '取消发布失败',
            duration: 50,
            closable: true,
          })
        }
      })
      .catch(error => {
        console.error(error)
        this.$Message['error']({
          background: true,
          content: '异常错误,请检查网络或后端服务',
          duration: 8,
          closable: true,
        })
      })
    },
    public_post(post_id) {
        this.pub_value.show = true
        this.publish_data.post_id = post_id
    },
    publish_post(pub_data) {
      var data = new Object
      data.post_id = pub_data.post_id
      data.post_url = pub_data.post_url
      data.post_create_datetime = String(pub_data.post_create_datetime.getTime()).slice(0, 10)
      data.post_update_datetime = String(pub_data.post_update_datetime.getTime()).slice(0, 10)
      data.post_class = pub_data.post_class
      data.post_tags = pub_data.post_tags
      data.post_summary = pub_data.post_summary || ''

      var form_string = Object.values(data).sort().join('_')

      data.hash = this.get_hash(form_string)
      this.hash_cookie()
      if (this.simple_check(data)) {
        this.axios.post('post/publish_state', data)
        .then(response => {
          if ( response.data.success ) {
            this.$Message['success']({
              background: true,
              content: '发布成功',
              duration: 5,
              closable: true,
            })
            this.pub_value.show = false
            this.reset_data += 1
            this.get_post_list()
          } else {
            var state = this.auth_invalid(response)
            if (response.data.data == 'not_change') {
              this.$Message['info']({
                background: true,
                content: '文章内容没有变化',
                duration: 3,
                closable: true,
              })
            } else {
              this.$Message['warning']({
                background: true,
                content: '发布失败',
                duration: 50,
                closable: true,
              })
            }
          }
        })
        .catch(error => {
          console.error(error)
          this.$Message['error']({
            background: true,
            content: '异常错误,请检查网络或后端服务',
            duration: 8,
            closable: true,
          })
        })
      }
    },
    simple_check(data) {
      // 在提交之前做的检测
      var check = new Array
      if (! data.post_url.trim()) {
        check.push('URL')
      }
      /*

      some check

      */
      if (check.length == 0) {
        return true
      } else {
        this.$Message.info({
          background: true,
          content: check.join(', ') + '  不能为空',
          duration: 5,
          closable: true,
        })
        return false
      }

    },
    pub_show_change() {
      this.pub_value.show = false
      this.reset_data += 1
    },
    page_num_change(page_num) {
      this.upload_data.page_num = page_num
      this.get_post_list()
    },
    page_size_change(page_size_num) {
      this.upload_data.post_num_per_page = page_size_num
      if (this.upload_data.page_num == 1) {
        this.get_post_list()
      }
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
      this.upload_data.page_num = 1
      this.get_post_list()
    },
    reset_search() {
      this.upload_data.search_on = false
      this.upload_data.search_keyword = ''
      this.upload_data.search_status = 0
      this.upload_data.search_class = 0
    },
    request_post(data, url, msg) {
      var msg_data = {
        list: ['列表获取完成', '列表获取失败'],
        remove: ['放入回收站完成', '放入回收站失败'],
        cancel_remove: ['文档恢复完成', '文档恢复失败'],
        del: ['彻底删除成功', '彻底删除失败'],
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
            this.post_list_data = response.data.data.list_data
            this.total_post_num = response.data.data.total_post_num
          } else if (msg == 'remove' || msg == 'cancel_remove' || msg == 'del') {
            this.get_post_list()
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
    remove_post(post_id) {
      var data = {post_id: post_id}
      var return_data = this.request_post(data, 'post/remove', 'remove')
    },
    cancel_remove(post_id) {
      var data = {post_id: post_id}
      this.request_post(data, 'post/cancel_remove', 'cancel_remove')
    },
    del_post(post_id) {
      var data = {post_id: post_id}
      this.request_post(data, 'post/delete', 'del')
    },
    cancel_delete() {

    },
    get_post_list() {
      var data = this.upload_data
      this.request_post(data, 'post/get_list', 'list')
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
  .post_button {
    margin-left: 2px;
    margin-right: 2px;
  }
</style>