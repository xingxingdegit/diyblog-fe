<template>
  <div id="post_create">
    <header>
      <Input element-id="post_title" id="title" v-model="upload_data.post_title" placeholder="标题" style="width: 30%" />
      代码样式:
      <Select v-model="upload_data.code_style" style="width:15%">
          <Option v-for="(style, index) in style_list" 
            :value="style" 
            :key="index">
              {{ style }}
          </Option>
      </Select>
    </header>
    <section>
      <mavon-editor 
        ref=mavon
        id="content" 
        v-model="upload_data.post_content" 
        :externalLink="externalLink"
        :codeStyle="upload_data.code_style"
        @imgAdd="upload_file"
        @imgDel="img_del"
        />
    </section>
    <footer id="post_op">
      <Button type="info" class="post_button" @click="pub_value.show=true">发布</Button>
      <Button type="success" class="post_button" @click="save_post()">保存草稿</Button>
    </footer>
    <Published
      :pub_show="pub_value.show"
      :reset_publish="reset_data"
      :post_id="upload_data.post_id"
      @pub-show="pub_show_change"
      @publish-post="publish_post"
     />
    
  </div>
</template>

<script>
import crypto from 'crypto'
import Published from './Published.vue'

export default {
  name: 'post-create',
  data () {
    return {
      upload_data: {
        post_title: '',     //上传的文档标题
        post_content: '',   //文档内容
        post_id: 0,         //如果是从编辑界面过来的， 函数会为这个填入文档id
        code_style: 'github',
      },
      edit_title: '',    //如果是编辑界面过来的，会存在里面，title与这个一样就不会去检查是否存
      pub_value: {
        show: false,
      },
      externalLink: {
        markdown_css: function() {
          // 这是你的markdown css文件路径
          return './static/markdown/github-markdown.min.css';
        },
        hljs_js: function() {
          // 这是你的hljs文件路径
          return './static/highlightjs/highlight.min.js';
        },
        hljs_css: function(css) {
          // 这是你的代码高亮配色文件路径
          return './static/highlightjs/styles/' + css + '.min.css';
        },
        hljs_lang: function(lang) {
          // 这是你的代码高亮语言解析路径
          return './static/highlightjs/languages/' + lang + '.min.js';
        },
        katex_css: function() {
          // 这是你的katex配色方案路径路径
          return './static/katex/katex.min.css';
        },
        katex_js: function() {
          // 这是你的katex.js路径
          return './static/katex/katex.min.js';
        },
      },
      style_list: [
        'agate',
        'androidstudio',
        'arduino-light',
        'arta',
        'ascetic',
        'atelier-cave-dark',
        'atelier-cave-light',
        'atelier-dune-dark',
        'atelier-dune-light',
        'atelier-estuary-dark',
        'atelier-estuary-light',
        'atelier-forest-dark',
        'atelier-forest-light',
        'atelier-heath-dark',
        'atelier-heath-light',
        'atelier-lakeside-dark',
        'atelier-lakeside-light',
        'atelier-plateau-dark',
        'atelier-plateau-light',
        'atelier-savanna-dark',
        'atelier-savanna-light',
        'atelier-seaside-dark',
        'atelier-seaside-light',
        'atelier-sulphurpool-dark',
        'atelier-sulphurpool-light',
        'atom-one-dark',
        'atom-one-light',
        'brown-paper',
        'codepen-embed',
        'color-brewer',
        'darcula',
        'dark',
        'darkula',
        'default',
        'docco',
        'dracula',
        'far',
        'foundation',
        'github-gist',
        'github',
        'googlecode',
        'grayscale',
        'gruvbox-dark',
        'gruvbox-light',
        'hopscotch',
        'hybrid',
        'idea',
        'ir-black',
        'kimbie.dark',
        'kimbie.light',
        'magula',
        'mono-blue',
        'monokai-sublime',
        'monokai',
        'obsidian',
        'ocean',
        'paraiso-dark',
        'paraiso-light',
        'pojoaque',
        'purebasic',
        'qtcreator_dark',
        'qtcreator_light',
        'railscasts',
        'rainbow',
        'routeros',
        'school-book',
        'solarized-dark',
        'solarized-light',
        'sunburst',
        'tomorrow-night-blue',
        'tomorrow-night-bright',
        'tomorrow-night-eighties',
        'tomorrow-night',
        'tomorrow',
        'vs',
        'vs2015',
        'xcode',
        'xt256',
        'zenburn'
      ],
    }
  },
  components: {
    Published,
  },
  props: {
    reset_data: Number
  },
  watch: {
    reset_data: function() {
      var data = this.$options.data()
      this.$data.upload_data = data.upload_data
      this.$data.edit_title = data.edit_title
      this.$data.pub_value = data.pub_value
    },
    // 监控文档的标题与url的变化，提示是否已经存在
    'upload_data.post_title': function() {
      if (this.upload_data.post_title != this.edit_title) {
        this.check_title()
      }
    },
  },
  created: function() {
    document.title = '编辑文章'
    this.get_post()
  },
  methods: {
    pub_show_change(show) {
      this.pub_value.show = show
    },
    upload_file(pos, file) {
      if (file.size > 10000) {
        this.$Modal.confirm({
          title: '是否继续',
          content: '<p>文件大于10MB, 是否继续上传</P><p style="color: red"> 注意：服务端默认限制是10MB，如没有修改可能会上传失败</p>',
          okText: '继续',
          onOk: () => {
            this.upload_file_second(pos, file)
          },
          onCancel: () => {
            this.$Message.info('取消上传');
          }
        });
      } else {
        this.upload_file_second(pos, file)
      }
    },
    upload_file_second(pos, file) {
      var formdata = new FormData()
      formdata.append(pos, file)
      this.hash_cookie()
      this.axios({
        url: 'upload_file',
        method: 'POST',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        if (response.data.success) {
          this.$Message.success({
            background: true,
            content: '上传成功'
          });
          // 找到对应pos的位置，替换成url。  pos就是那个数字。
          this.$refs.mavon.$img2Url(pos, response.data.data[pos])
        } else {
          var state = this.auth_invalid(response)
          this.$Message.warning({
            background: true,
            content: '上传失败',
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
    img_del(pos) {
    },
    auth_invalid(response) {
      if (response.data.data == 'auth_invalid') {
        this.$Modal.confirm({
          title: '是否跳转',
          content: '<p>登录信息失效，是否跳转登录页面</P><p style="color: red"> 注意：跳转会使编辑的文档消失, 注意保存数据</p>',
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
    simple_check(data) {
      // 在提交之前做的检测
      var check = new Array()
      if (! data.post_title.trim()) {
        check.push('标题')
      }
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
    get_args() {
      var args = document.location.hash.split('?')[1]
      var args_obj = new Object()
      if (args) {
        args = args.split('&')
        for (var i=0;i<args.length;i++) {
          var key_value = args[i].split('=')
          args_obj[key_value[0]] = key_value[1]
        }
        return args_obj
      } else {
        return false
      }
    },
    // 用于点击编辑跳转过来的，通过id信息获取文档。
    get_post() {
      if (document.location.hash.split('?')[0].split('/')[1] == "Edit") {
        var id = this.get_args().id
        if (id) {
          var data = {id: id}
          data.hash = this.get_hash(id)
          this.hash_cookie()
          this.axios.post('post/get', data)
          .then(response => {
            if (response.data.success) {
              this.edit_title = response.data.data.title
              this.upload_data.post_title = response.data.data.title
              this.upload_data.post_id = response.data.data.id
              this.upload_data.post_content = response.data.data.posts
              this.upload_data.code_style = response.data.data.code_style
              this.$Message.success({
                background: true,
                content: '文档获取完成'
              });
            } else {
              var state = this.auth_invalid(response)
              this.$Message.warning({
                background: true,
                content: '文档获取失败',
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
      }
    },
    check_title() {
      this.axios.get('post/check', {
        params: {
          post_title: this.upload_data.post_title.trim()
        }
      })
      .then(response => {
        var title = document.getElementById('post_title')
        if (response.data.data.title || response.data.success == false) {
          title.style.borderColor = 'red'
        } else {
          title.style.borderColor = ''
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
    save_post() {
      var data = this.upload_data
      var form_string = Object.values(data).sort().join('_')

      data.hash = this.get_hash(form_string)
      this.hash_cookie()
      if (this.simple_check(data)) {
        this.axios.post('./post/save', data)
        .then(response => {
          if ( response.data.success ) {
            if (response.data.data.id && this.upload_data.post_id == 0) {
              this.upload_data.post_id = response.data.data.id
            }
            this.edit_title = this.upload_data.post_title
            this.edit_content = this.upload_data.post_content
            this.$Message['success']({
              background: true,
              content: '保存成功',
              duration: 5,
              closable: true,
            })
          } else {
            var state = this.auth_invalid(response)
            this.$Message['warning']({
              background: true,
              content: '保存失败',
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
      }
    },
    publish_post(publish_data) {
      var data = this.upload_data
      data.post_url = publish_data.post_url
      data.post_create_datetime = String(publish_data.post_create_datetime.getTime()).slice(0, 10)
      data.post_update_datetime = String(publish_data.post_update_datetime.getTime()).slice(0, 10)
      data.post_class = publish_data.post_class
      data.post_tags = publish_data.post_tags
      data.post_summary = publish_data.post_summary || ''

      var form_string = Object.values(data).sort().join('_')

      data.hash = this.get_hash(form_string)
      this.hash_cookie()
      if (this.simple_check(data)) {
        this.axios.post('./post/publish', data)
        .then(response => {
          if ( response.data.success ) {
            if (response.data.data.id && this.upload_data.post_id == 0) {
              this.upload_data.post_id = response.data.data.id
            }
            this.edit_title = this.upload_data.post_title
            this.edit_content = this.upload_data.post_content
            this.$Message['success']({
              background: true,
              content: '发布成功',
              duration: 5,
              closable: true,
            })
            this.pub_value.show = false
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
    printTitle() {
      console.log(this.upload_data.post_title)
    }
  }
}
</script>

<style scoped>
  /*提示信息的z-index是1016*/
  /*编辑框*/
  .v-note-wrapper {
    z-index: 500;
  }
  /*下拉菜单*/
  .ivu-select-dropdown {
    z-index: 800;
  }
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
