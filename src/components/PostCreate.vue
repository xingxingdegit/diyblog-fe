<template>
  <div id="post_create">
    <header>
      <Input element-id="post_title" id="title" v-model="post_title" placeholder="标题" style="width: 30%" />
      代码样式:
      <Select v-model="code_style" style="width:15%">
          <Option v-for="(style, index) in style_list" 
            :value="style" 
            :key="index">
              {{ style }}
          </Option>
      </Select>
    </header>
    <section>
      <mavon-editor 
        id="content" 
        v-model="post_content" 
        :externalLink="externalLink"
        :codeStyle="code_style"
        />
    </section>
    <footer id="post_op">
      <Button type="info" class="post_button" @click="printContent()">发布</Button>
      <Button type="success" class="post_button" @click="save_post()">保存草稿</Button>
    </footer>

  </div>
</template>

<script>

import crypto from 'crypto'

export default {
  name: 'post-create',
  data () {
    return {
      post_title: '',     //上传的文档标题
      post_content: '',   //文档内容
      post_id: 0,         //如果是从编辑界面过来的， 函数会为这个填入文档id
      post_url: '',
      edit_title: '',    //如果是编辑界面过来的，会存在里面，title与这个一样就不会去检查是否存
      edit_url: '',      // 跟edit_title一样,   这俩也是为了防止保存完以后，修改了，然后又改回来了。
      code_style: 'github',
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
  watch: {
    // 监控标题与url的变化，提示是否已经存在
    post_title: function() {
      if (this.post_title != this.edit_title) {
        this.check_title()
      }
    },
    post_url: function() {
      if (this.post_url != this.edit_url) {
        this.check_url()
      }
    }
  },
  created: function() {
    this.get_post()
  },
  methods: {
    simple_check() {
      // 在提交之前做的检测
      var check = new Array()
      if (! this.post_title) {
        check.push('标题')
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
    // 用于点击编辑跳转过来的，通过id信息获取文档。
    get_post() {
      var id = this.get_args().id
      if (id) {
        this.axios.get('post/get', {
          params: {
            id: id
          }
        })
        .then(response => {
          if (response.data.success) {
            this.edit_title = response.data.data.title
            this.edit_url = response.data.data.content
            this.post_title = response.data.data.title
            this.post_content = response.data.data.content
            this.$Message.success({
              background: true,
              content: '文档获取完成'
            });
          } else {
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
              duration: 5,
              closable: true,
            });
        })
      } else {
        return false
      }
    },
    check_title() {
      this.axios.get('post/check', {
        params: {
          title: this.post_title
        }
      })
      .then(response => {
        var title = document.getElementById('post_title')
        if (response.data.data.title) {
          title.style.borderColor = 'red'
        } else {
          title.style.borderColor = ''
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    printContent() {
      console.log(this.post_content)
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
    save_post() {
      var data = {title: this.post_title, content: this.post_content, id: this.post_id}
      var form_string = [data.title, data.content, data.id].sort().join('_')

      data.hash = this.get_hash(form_string)
      this.hash_cookie()
      if (this.simple_check()) {
        this.axios.post('./post/save', data)
        .then(response => {
          if ( response.data.success ) {
            if (response.data.data.id && this.post_id == 0) {
              this.post_id = response.data.data.id
            }
            this.edit_title = this.post_title
            this.edit_content = this.post_content
            this.$Message['success']({
              background: true,
              content: '保存成功',
              duration: 5,
              closable: true,
            })
          } else {
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
    printTitle() {
      console.log(this.post_title)
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
