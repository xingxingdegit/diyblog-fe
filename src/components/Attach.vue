<template>
  <div>
    <header style="margin: 20px 50px;">
      <p>
        <Select v-model="upload_data.search_status" style="width:20%" placeholder="文件状态">
          <Option value="1">正常</Option>
          <Option value="2">已失效</Option>
        </Select>
        <Select v-model="upload_data.size_level" style="width:20%" placeholder="缩略图尺寸">
          <Option value="1">64x64</Option>
          <Option value="2">128x128</Option>
          <Option value="3">256x256</Option>
          <Option value="4">512x512</Option>
          <Option value="5">1024x1024</Option>
          <Option value="6">2048x2048</Option>
          <Option value="7">4096x4096</Option>
        </Select>
        <Select v-model="upload_data.search_mimetype" filterable style="width: 20%" placeholder="文件类型">
          <Option v-for="(name, index) in mimetype_list_data" :value="name" :key="index">{{ name }}</Option>
        </Select>
        <Button type="primary" shape="circle" icon="ios-search" @click="search_attach_list()" style="margin-left: 10px;">查询</Button>
        <Button type="primary" shape="circle" icon="md-refresh" @click="reset_search()" style="margin-left: 10px;">重置</Button>
      </p>
      <Button type="primary" ghost @click="create_attach" style="margin-top: 20px;margin-left:10px;">上传附件</Button>
    </header>
    <div>
      <Modal
        v-model="create_attach_show"
        :ok-text="upload_file_setup"
        title="上传附件"
        :mask-closable="false"
        :loading="loading"
        @on-ok="ok_attach"
        @on-cancel="cancel_attach">
        <div style="margin-bottom: 30px;margin-left:25px;margin-top: 10px;">
          <RadioGroup v-model="upload_file_private">
            <Radio label="1" style="margin-left: 30px;margin-right: 30px;">
              <span>公开的</span>
              <Icon type="md-open" />
            </Radio>
            <Radio label="2" style="margin-left: 30px;">
              <span>私密的</span>
              <Icon type="ios-lock" />
            </Radio>
          </RadioGroup>
          <Tooltip content="公开的: 任何人都可以访问。  私密的: 只有登录以后可以访问。" placement="top" theme="light" max-width="100%">
            <Icon type="ios-help-circle-outline" />
          </Tooltip>
        </div>
        <Upload 
          multiple
          action="/"
          type="drag"
          :before-upload="before_upload"
          >
          <Button icon="ios-cloud-upload-outline">上传文件</Button>
        </Upload>
        <table style="width: 80%; margin-left: 5%;">
          <tr v-for="(file_data, index) in upload_file_list" :key="index">
            <td>{{file_data.file.name}}</td>
            <td>
              <span style="margin-right: 10px;text-aligin=right" v-if="file_data.loading">
                <Spin v-if="file_data.success === null" size="small"></Spin>
                <Icon v-else-if="file_data.success === true" type="ios-checkmark" />
                <Icon v-else type="ios-close" />
              </span>
            </td>
            <td>
              <a v-if="file_data.success === true" :href="file_data.url" target="_blank">download url</a>
            </td>
          </tr>
        </table>
      </Modal>
    </div>
    <section style="margin: 50px; margin-left: 80px;margin-right: 80px;">
      <span v-for="(attach, index) in attach_list_data" :key="attach.id" style="cursor: pointer;"  @click="attach_info_manage(index)">
        <img v-if="attach.mini_url" :src="attach.mini_url" />
        <span v-else><Icon size="50" type="logo-tux" />文件无法展示</span>
      </span>
    </section>
    <section style="text-align: center; margin-top: 30px;">
      <Page :total="total_attach_num" :current="upload_data.page_num" :page-size="upload_data.attach_num_per_page" :page-size-opts="page_size_opts"
            transfer show-total show-sizer @on-change="page_num_change" @on-page-size-change="page_size_change" />
    </section>
    <div>
      <Drawer
        title="详细信息"
        v-model="attach_info_show"
        width="450px"
      >
        <a :href="attach_info_data.link" target="_blank">
          <span v-if="attach_info_data.is_image == 1" style="margin: 0px;">
            <img :src="attach_info_data.link" width="100%"/>
          </span>
          <span v-else>
            点击下载
          </span>
        </a>
        <div class="attach_info">
          <p class="attach_inner">附件名称: </p>
          <p>{{attach_info_data.file_name}}</p>
        </div>
        <hr />
        <div class="attach_info">
          <p class="attach_inner">附件类型: </p>
          <p>{{attach_info_data.mimetype}}</p>
        </div>
        <hr />
        <div class="attach_info">
          <p class="attach_inner">附件大小: </p>
          <p>{{attach_info_data.file_size}} KB</p>
        </div>
        <hr />
        <div class="attach_info">
          <p class="attach_inner">附件尺寸(宽x高): </p>
          <p v-if="attach_info_data.is_image == 1">{{attach_info_data.file_size2}}</p>
          <p v-else>无</p>
        </div>
        <hr />
        <div class="attach_info">
          <p class="attach_inner">上传时间: </p>
          <p>{{attach_info_data.upload_datetime}}</p>
        </div>
        <hr />
        <div class="attach_info">
          <p class="attach_inner">普通链接: </p>
          <p>{{attach_info_data.link}}</p>
        </div>
        <hr />
        <div class="attach_info">
          <p class="attach_inner">Markdown链接: </p>
          <p v-if="attach_info_data.is_image == 1">![{{attach_info_data.file_name}}]({{attach_info_data.link}})</p>
          <p v-else>无</p>
        </div>
        <hr />
        <div class="attach_info">
          <RadioGroup v-model="attach_info_data.private">
            <Radio label="1" style="margin-left: 20px;margin-right: 30px;" disabled>
              <span>公开</span>
              <Icon type="md-open" />
            </Radio>
            <Radio label="2" style="margin-left: 30px;" disabled>
              <span>私密</span>
              <Icon type="ios-lock" />
            </Radio>
          </RadioGroup>
          <Tooltip content="公开的: 任何人都可以访问。  私密的: 只有登录以后可以访问。" placement="top" theme="light" max-width="100%">
            <Icon type="ios-help-circle-outline" />
          </Tooltip>
        </div>
        <hr />
        <div class="attach_info">
          <RadioGroup v-model="attach_info_data.status" disabled>
            <Radio label="1" style="margin-left: 20px;margin-right: 30px;" disabled>
              <span>正常</span>
              <Icon type="md-attach" />
            </Radio>
            <Radio label="2" style="margin-left: 30px;" disabled>
              <span>失效</span>
              <Icon type="ios-trash" />
            </Radio>
          </RadioGroup>
          <Tooltip content="失效: 通过重命名文件使无法访问。删除: 彻底删除文件。" placement="top" theme="light" max-width="100%">
            <Icon type="ios-help-circle-outline" />
          </Tooltip>
        </div>
        <hr />
        <div class="demo-drawer-footer" style="margin-left: 30px;margin: 50px;">
          <Button type="info" style="margin-right: 35px" @click="attach_info_show=false">取消</Button>
          <Button v-if="attach_info_data.status == 1" type="warning" 
                  @click="invalid_attach(attach_info_data.file_name, attach_info_data.file_id)" 
                  style="margin-right: 35px">
                  失效
          </Button>
          <Button v-else-if="attach_info_data.status == 2" type="success" style="margin-right: 35px"
                  @click="recover_attach(attach_info_data.file_name, attach_info_data.file_id)">
                  恢复
          </Button>
          <Poptip
            confirm
            transfer
            title="确定删除吗?"
            width="80px"
            @on-ok="delete_attach(attach_info_data.file_name, attach_info_data.file_id)"
            @on-cancel="cancel_delete">
            <Button type="error">删除</Button>
          </Poptip>
        </div>
      </Drawer>
    </div>
    <footer>
    </footer>
  </div>
</template>

<script>
import crypto from 'crypto'

export default {
  name: 'attach-show',
  data () {
    return {
      upload_data: {
        page_num: 1,
        attach_num_per_page: 20,
        search_on: false,
        search_mimetype: '',
        search_status: 0,
        search_private: 0,
        // 缩略图
        size_level: "1",
      },
      // 附件列表
      attach_list_data: [],
      // 分页
      total_attach_num: 0,
      page_size_opts: [10, 20, 30, 40, 50, 60, 70, 80],
      // mimetype 的select
      mimetype_list_data: [],
      // 上传附件
      create_attach_show: false,
      loading: true,
      upload_file_list: [],
      upload_file_setup: '上传',
      upload_file_private: "1",   //1公开的，  2私密的。
      // 侧边栏
      attach_info_show: false,
      attach_info_data: {
        file_name: '',
        mimetype: '',
        file_size: '',
        file_size2: '',
        upload_datetime: '',
        link: '',
        markdown_link: '',
        private: '',
        status: '',
        is_image: '',
        file_id: '',
      },
      upload_file_limit: false,
    }
  },
  created: function() {
    document.title = '附件管理'
    this.get_attach_list()
    this.get_mimetype_list()
  },
  methods: {
    get_upload_file_limit() {
      if (this.upload_file_limit == false) {
        var data = {
          set_type: 'upload_file',
        }
        var form_string = Object.values(data).sort().join('_')
        data.hash = this.get_hash(form_string)
        this.hash_cookie()
        this.axios.post('setting/get', data)
        .then(response => {
          if (response.data.success) {
            var limit_data = response.data.data
            this.upload_file_limit = {
              upload_file_size: Number(limit_data.upload_file_size),
              upload_file_ext: limit_data.upload_file_ext.split(','),
              upload_file_mime: limit_data.upload_file_mime.split(','),
            }
          } else {
            var state = this.auth_invalid(response)
            this.$Message.warning({
              background: true,
              content: '上传限制信息获取失败,上传失败不会提示原因',
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
      }
    },
    cancel_delete() {
    },
    invalid_attach(file_name, file_id){
      var data = {file_name: file_name, file_id: file_id}
      this.request_attach(data, 'attach/invalid_file', 'invalid')
    },
    recover_attach(file_name, file_id) {
      var data = {file_name: file_name, file_id: file_id}
      this.request_attach(data, 'attach/recover_file', 'recover')
    },
    delete_attach(file_name, file_id) {
      var data = {file_name: file_name, file_id: file_id}
      this.request_attach(data, 'attach/delete_file', 'delete')
    },
    reset_search() {
      this.upload_data.search_on = false
      this.upload_data.search_mimetype = ''
      this.upload_data.search_status = 0
      this.upload_data.search_private = 0
    },
    attach_info_manage(index) {
      this.$data.attach_info_data = this.$options.data().attach_info_data
      this.attach_info_show = true

      var file_data = this.attach_list_data[index]
      this.attach_info_data.file_name = file_data.filename
      this.attach_info_data.file_name = file_data.filename
      this.attach_info_data.mimetype = file_data.mimetype
      this.attach_info_data.file_size = parseInt(file_data.size / 1024)
      this.attach_info_data.file_size2 = file_data.width + 'x' + file_data.height
      this.attach_info_data.upload_datetime = new Date(Number(file_data.uptime + '000')).toLocaleString()
      this.attach_info_data.link = file_data.url
      this.attach_info_data.private = String(file_data.private)
      this.attach_info_data.status = String(file_data.status)
      this.attach_info_data.is_image = file_data.is_image
      this.attach_info_data.file_id = file_data.id

    },
    create_attach() {
      this.create_attach_show = true
      this.upload_file_list = []
      this.upload_file_setup = '上传'
      this.loading = true
      this.get_upload_file_limit()
    },
    before_upload(file) {
      if (file.size > this.upload_file_limit.upload_file_size) {
        this.$Message.warning({
          background: true,
          content: file.name + ' ' + file.size + 'Bytes' + ' 大于限制大小: ' + this.upload_file_limit.upload_file_size + ' Bytes',
          duration: 10
        })
      }
      var filename_list = file.name.split('.')
      var ext = filename_list[filename_list.length-1]
      if (this.upload_file_limit.upload_file_ext.indexOf(ext) < 0) {
        this.$Message.warning({
          background: true,
          content: file.name + ' 扩展名: ' + ext + '. 没有在允许的扩展名内',
          duration: 10
        })
      }
      var first_type = file.type.split('/')[0]
      if (this.upload_file_limit.upload_file_mime.indexOf(first_type) < 0) {
        this.$Message.warning({
          background: true,
          content: file.name + ' 主MIME类型: ' + first_type + '. 没有在允许的MIME类型内',
          duration: 10
        })
      }
      var file_data = {file: file, loading: false, success: null, url: ''}
      this.upload_file_list.push(file_data)
      return false
    },
    ok_attach () {
      if (this.upload_file_setup == '完成') {
        this.get_attach_list()
        return
      }
      var length = this.upload_file_list.length
      for (var index = 0; index < length; index ++) {
        var file_data = this.upload_file_list[index]
        file_data.loading = true
        if (file_data.success != true) {
          this.upload_file_second(index, file_data, length)
        }
      }
    },
    cancel_attach () {
    },
    upload_file_second(pos, file_data, length) {
      var formdata = new FormData()
      var file = file_data.file
      formdata.append(pos, file)
      formdata.append('private', this.upload_file_private)
      this.hash_cookie()
      this.axios({
        url: 'upload_file',
        method: 'POST',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        if (length - 1 == pos) {
          this.upload_file_setup = '完成'
          this.loading = false
        }
        if (response.data.success) {
          this.$Message.success({
            background: true,
            content: file.name + ' 上传成功'
          });
          file_data.url = response.data.data[pos]
          file_data.success = true
        } else {
          var state = this.auth_invalid(response)
          this.$Message.warning({
            background: true,
            content: file.name + ' 上传失败',
            duration: 5,
            closable: true,
          });
          file_data.success = false
        }
      })
      .catch(error => {
        if (length - 1 == pos) {
          this.upload_file_setup = '完成'
          this.loading = false
        }
        console.log(error)
        this.$Message.error({
          background: true,
          content: '请求异常,请检查网络或后端服务',
          duration: 10,
          closable: true,
        });
        file_data.success = false
      })
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
    page_num_change(page_num) {
      this.upload_data.page_num = page_num
      this.get_attach_list()
    },
    page_size_change(page_size_num) {
      this.upload_data.attach_num_per_page = page_size_num
      if (this.upload_data.page_num == 1) {
        this.get_attach_list()
      }
    },
    get_attach_list() {
      var data = this.upload_data
      this.request_attach(data, 'attach/get_list', 'list')
    },
    get_private_file(data) {

    },
    upload_private_file() {

    },
    get_mimetype_list() {
      this.axios.get('attach/mimetype_list')
        .then(response => {
          if (response.data.success) {
            this.mimetype_list_data = response.data.data
          }
        })
    },
    search_attach_list() {
      this.upload_data.search_on = true
      this.upload_data.page_num = 1
      this.get_attach_list()
    },
    request_attach(data, url, msg) {
      var msg_data = {
        list: ['列表获取完成', '列表获取失败'],
        invalid: ['附件失效完成', '附件失效失败'],
        recover: ['附件恢复完成', '附件恢复失败'],
        delete: ['彻底删除成功', '彻底删除失败'],
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
            this.attach_list_data = response.data.data.list_data
            this.total_attach_num = response.data.data.total_attach_num
          } else if (msg == 'invalid') {
            this.attach_info_data.status = "2"
            this.get_attach_list()

          } else if (msg == 'recover') {
            this.attach_info_data.status = "1"
            this.get_attach_list()

          } else if (msg == 'delete') {
            this.$data.attach_info_data = this.$options.data().attach_info_data
            this.attach_info_show = false
            this.get_attach_list()
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
  span {
    margin: 20px;
  }
  .attach_info {
    margin-top: 25px;
  }
  .attach_inner {
    margin-bottom: 3px;
  }
</style>