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
      <p><Input v-model="post_url" element-id="post_url" placeholder="访问URL: /post/get/<url>" style="width: 100%" /></p>

      <p>分类:</p>
      <p>
        <Select v-model="post_class_choice" filterable style="width: 100%" placeholder="分类">
          <Option v-for="item in class_list" :value="item.id" :key="item.id">{{ item.classname }}</Option>
        </Select>
      </p> 
      <p>标签:</p>
      <p>
        <Select v-model="post_tags_choice" multiple filterable style="width: 100%" placeholder="标签">
          <Option v-for="item in tags_list" :value="item.id" :key="item.id">{{ item.tagname }}</Option>
        </Select>
      </p>

      <p>发布日期:</p>
      <p><DatePicker v-model="post_create_datetime" size="default" type="datetime" style="width: 100%" format="yyyy-MM-dd HH:mm" placeholder="发布时间"></DatePicker></p>
      <p>修改日期:</p>
      <p><DatePicker v-model="post_update_datetime" size="default" type="datetime" style="width: 100%" format="yyyy-MM-dd HH:mm" placeholder="发布时间"></DatePicker></p>
      <p>摘要信息:</p>
      <p>
      <Input v-model="post_summary" type="textarea" :autosize="{minRows: 3, maxRows: 8}" placeholder="编辑..." />
      </p>

      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="$emit('pub-show', false)">取消</Button>
        <Button type="primary" @click="publish_post">发布</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>

export default {
  name: 'publish',
  data () {
    return {
      post_url: '',
      post_create_datetime: new Date(),
      post_update_datetime: new Date(),
      class_list: {},
      post_class_choice: 0,
      tags_list: [],
      post_tags_choice: [],
      post_summary: '',
      request_count: 0,
      post_url_exist: false,
    }
  },
  created: function() {
  },
  watch: {
    reset_publish: function() {
      this.get_value()
    },
    post_url: function() {
      var url = document.getElementById('post_url')
      if (post_url_exist) {
        url.style.borderColor = 'red'
      } else {
        url.style.borderColor = ''
      }
    },
    pub_show: function() {
      if (this.request_count === 0) {
        this.get_class_list()
        this.get_tags_list()
        this.get_value()
        this.request_count += 1
      }
    },
  },
  props: {
    pub_show: Boolean,
    url: String,
    title: String,
    create_datetime: Number,
    class_choice: Number,
    tags_choice: Array,
    summary: String,
    reset_publish: Number,
  },
  created: function() {
  },
  methods: {
    get_value: function() {
      this.post_url = this.url || this.title || '',
      this.post_create_datetime = this.get_datetime(),
      this.post_update_datetime = new Date()
      this.post_class_choice = this.class_choice || 0,
      this.post_tags_choice = this.tags_choice || [],
      this.post_summary = this.summary || ''
    },
    publish_post: function() {
      var request_data = {
        

      }
    },
    get_datetime() {
      var date_num = Number(this.create_datetime + '000')
      if (date_num) {
        return new Date(date_num)
      } else {
        return new Date
      }
    },
    get_class_list() {
      this.axios.get('/class/list')
        .then(response => {
          if (response.data.success) {
            this.class_list = response.data.data
            console.log(this.class_list)
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