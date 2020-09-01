<template>
  <div>
    <Drawer
      title="发布文章" 
      width="350px"
      :value="pub_show"
      :closable="false" 
      :mask-closable="false"
    >
      <p>URL:</p>
      <p><Input v-model="upload_data.post_url" element-id="post_url" placeholder="访问URL: /post/get/<url>" style="width: 100%" /></p>

      <p>分类:</p>
      <p>
        <Select v-model="upload_data.post_class" filterable style="width: 100%" placeholder="分类">
          <Option v-for="item in class_list" :value="item.id" :key="item.id">{{ item.classname }}</Option>
        </Select>
      </p> 
      <p>标签:</p>
      <p>
        <Select v-model="upload_data.post_tags" multiple filterable style="width: 100%" placeholder="标签">
          <Option v-for="item in tags_list" :value="item.id" :key="item.id">{{ item.tagname }}</Option>
        </Select>
      </p>

      <p>发布日期:</p>
      <p><DatePicker v-model="upload_data.post_create_datetime" size="default" type="datetime" style="width: 100%" format="yyyy-MM-dd HH:mm" placeholder="发布时间"></DatePicker></p>
      <p>修改日期:</p>
      <p><DatePicker v-model="upload_data.post_update_datetime" size="default" type="datetime" style="width: 100%" format="yyyy-MM-dd HH:mm" placeholder="发布时间"></DatePicker></p>
      <p>摘要信息:</p>
      <p>
      <Input v-model="upload_data.post_summary" type="textarea" :autosize="{minRows: 3, maxRows: 8}" placeholder="编辑..." />
      </p>

      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="$emit('pub-show', false)">取消</Button>
        <Button type="primary" @click="publish_post">发布</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import crypto from 'crypto'

export default {
  name: 'publish',
  data () {
    return {
      upload_data: {
        post_id: 0,
        post_url: '',
        post_create_datetime: new Date(),
        post_update_datetime: new Date(),
        post_class: 0,
        post_tags: [],
        post_summary: '',
      },
      edit_url: '',
      class_list: {},
      tags_list: [],
      request_count: 0,
    }
  },
  created: function() {
  },
  watch: {
    reset_publish: function() {
      var data = this.$options.data()
      this.$data.upload_data = data.upload_data
      this.$data.edit_url = data.edit_url
      this.$data.class_list = data.class_list
      this.$data.tags_list = data.tags_list
      this.$data.request_count = data.request_count
    },
    'upload_data.post_url': function() {
      if (this.upload_data.post_url != this.edit_url) {
        this.axios.get('post/check', {
          params: {
            post_url: this.upload_data.post_url.trim()
          }
        })
        .then(response => {
          var url = document.getElementById('post_url')
          if (response.data.data.url || response.data.success == false) {
            url.style.borderColor = 'red'
          } else {
            url.style.borderColor = ''
          }
        })
        .catch(error => {
          console.log(error)
        })
      } else {
        var url = document.getElementById('post_url')
        if (url.style.borderColor == 'red') {
          url.style.borderColor = ''
        }
      }
    },
    pub_show: function() {
      if (this.request_count === 0 && this.pub_show === true) {
        this.get_post()
        this.get_class_list()
        this.get_tags_list()
        this.request_count += 1
      }
    },
  },
  props: {
    pub_show: Boolean,
    reset_publish: Number,
    post_id: Number,
  },
  created: function() {
  },
  methods: {
    check_title() {
      this.axios.get('post/check', {
        params: {
          post_url: this.upload_data.post_url.trim()
        }
      })
      .then(response => {
        var url = document.getElementById('post_url')
        if (response.data.data.url || response.data.success == false) {
          url.style.borderColor = 'red'
        } else {
          url.style.borderColor = ''
        }
      })
      .catch(error => {
        console.log(error)
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
    get_post() {
      if (this.post_id) {
        var data = {id: this.post_id, filter: 'state_publish'}
        var form_string = Object.values(data).sort().join('_')
        data.hash = this.get_hash(form_string)
        this.hash_cookie()
        this.axios.post('post/get', data)
        .then(response => {
          if (response.data.success) {
            this.edit_url = response.data.data.url
            this.upload_data.post_id = response.data.data.id
            this.upload_data.post_url = response.data.data.url || response.data.data.title
            this.upload_data.post_create_datetime = new Date(Number(response.data.data.create_time + '000'))
            this.upload_data.post_class = response.data.data.class
            this.upload_data.post_tags = response.data.data.tags
            this.upload_data.post_summary = response.data.data.summary
          } else {
            var state = this.auth_invalid(response)
            this.$Message.warning({
              background: true,
              content: '信息获取失败',
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
      } else {
        return false
      }
    },
    publish_post: function() {
      this.$emit('publish-post', this.upload_data)
    },
    get_class_list() {
      this.axios.get('/class/list')
        .then(response => {
          if (response.data.success) {
            this.class_list = response.data.data
          }
        })
    },
    get_tags_list() {
      this.axios.get('/tags/list')
        .then(response => {
          if (response.data.success) {
            this.tags_list = response.data.data
          }
        })
    },
  }
}
</script>
<style scoped>
  p {
    margin: 15px;
  }
</style>