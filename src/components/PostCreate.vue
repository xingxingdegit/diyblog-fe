<template>
  <div id="post_create">
    <header>
      <Input id="title" v-model="post_title" placeholder="标题" style="width: 30%" />
      <Select v-model="code_style" style="width:200px">
          <Option v-for="(style, index) in style_list" :value="style" :key="index">{{ style }}</Option>
      </Select>
      <Input :value="code_style" placeholder="test" style="width: 30%" />
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
      login_key: '',
      post_title: '',
      post_content: '',
      code_style: 'github',
      externalLink: {
        markdown_css: function() {
          // 这是你的markdown css文件路径
          return './markdown/github-markdown.min.css';
        },
        hljs_js: function() {
          // 这是你的hljs文件路径
          return './highlightjs/highlight.min.js';
        },
        hljs_css: function(css) {
          // 这是你的代码高亮配色文件路径
          return './highlightjs/styles/' + css + '.min.css';
        },
        hljs_lang: function(lang) {
          // 这是你的代码高亮语言解析路径
          return './highlightjs/languages/' + lang + '.min.js';
        },
        katex_css: function() {
          // 这是你的katex配色方案路径路径
          return './katex/katex.min.css';
        },
        katex_js: function() {
          // 这是你的katex.js路径
          return './katex/katex.min.js';
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
      var data = {title: this.post_title, content: this.post_content}
      var form_string = [data.title, data.content].sort().join('_')
      data.hash = this.get_hash(form_string)
      this.hash_cookie()
      this.axios.post('/admin/manager/post/save', data)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
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
  header {
    z-index: 100;
  }
  section {
    z-index: 10;
  }
</style>
