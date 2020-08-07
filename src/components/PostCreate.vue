<template>
  <div id="post_create">
    <Input id="title" v-model="post_title" placeholder="标题" style="width: 100%" />
    <mavon-editor id="content" v-model="post_content" />
    <div id="post_op">
      <Button type="info" class="post_button" @click="printContent()">发布</Button>
      <Button type="success" class="post_button" @click="printTitle()">保存草稿</Button>
    </div>

  </div>
</template>

<script>

export default {
  name: 'post-create',
  data () {
    return {
      login_key: '',
      post_title: '',
      post_content: ''
    }
  },
  methods: {
    check_title: function() {
      this.axios.get('/admin/manager/getkey')
        .then(response => {
          this.login_key = response.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    printContent() {
      console.log(this.post_content)
    },
    printTitle() {
      console.log(this.post_title)
    }
  }
}
</script>

<style scoped>
  #title {
    margin-top: 30px;
    margin-bottom: 30px;
  }
  #content {
    height: 100%;
  }
  #post_op {
    text-align: right;
  }
  button {
    margin: 20px;
  }
</style>
