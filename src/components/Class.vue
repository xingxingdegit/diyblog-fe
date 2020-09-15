<template>
  <div class="part">
    <div class="left_part">
      <div class="left_inner">
        <div class="left_part_inner">
          <Divider> 添加分类 </Divider>
        </div>
        <div class="left_part_inner">
          <p>分类名称:</p>
          <p><Input class="input_width" element-id="input_classname" placeholder="分类名称" v-model="upload_data.class_name"  /></p>
        </div>
        <div class="left_part_inner">
          <p>是否在首页显示:</p>
          <Select v-model="upload_data.class_status" class="input_width" placeholder="是否在首页显示">
            <Option value="1">显示</Option>
            <Option value="2">不显示</Option>
          </Select>
        </div>
        <div class="left_part_inner">
          <p>首页分类排序:</p>
          <p><InputNumber placeholder="降序排列，数字越大越靠前" class="input_width" :max="1000" :min="1" v-model="upload_data.class_sort"></InputNumber></p>
        </div>
        <div class="left_part_inner">
          <p>描述:</p>
          <p><Input type="textarea" v-model="upload_data.class_intro" :rows="4" placeholder="描述信息" /></p>
        </div>
        <div class="left_part_inner">
          <p>
            <span v-if="add_update==1"><Button class="add_update_button" @click="add_class" type="primary">添加</Button></span>
            <span v-else-if="add_update==2"><Button class="add_update_button" @click="add_class" type="primary">更新</Button></span>
            <span><Button @click="reset_upload" class="add_update_button" type="primary">重置</Button></span>
          </p>
        </div>
      </div>
    </div>
    <div class="right_part">
      <div class="right_inner">
        <div class="right_part_inner">
          <Divider> 分类列表 </Divider>
        </div>
        <div class="right_part_inner" style="margin-bottom: 35px">
          <Table stripe :columns="columns" :data="class_list_data">
            <template slot-scope="{ row }" slot="status">
              <span v-if="row.status == 1">显示</span>
              <span v-else-if="row.status == 2">不显示</span>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="primary" size="small" class="op_button" @click="edit_class(index)">编辑</Button>
              <Poptip
                confirm
                transfer
                title="确定删除吗?"
                width="80px"
                @on-ok="del_class(row.id, row.classname, row.count)"
                @on-cancel="cancel_delete">
                <Button type="error" size="small" class="op_button">删除</Button>
              </Poptip>
            </template>
          </Table>
        </div>
        <div style="text-align: center">
          <Page :total="total_class_num" :current="get_list_data.page_num" :page-size="get_list_data.class_num_per_page" :page-size-opts="page_size_opts"
          transfer show-total show-sizer @on-change="page_num_change" @on-page-size-change="page_size_change" />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import crypto from 'crypto'
export default {
  name: 'Setting',
  data () {
    return {
      login_key: 'abc',
      post_title: '',
      upload_data: {
        class_id: 0,
        class_name: '',
        class_status: '1',
        class_sort: 1,
        class_intro: '',
      },
      edit_classname: '',
      get_list_data: {
        page_num: 1,
        class_num_per_page: 10,
      },
      page_size_opts: [10, 20],
      total_class_num: 0,
      columns: [
        {
          title: '名称',
          key: 'classname',
        },
        {
          title: '首页显示',
          slot: 'status'
        },
        {
          title: '首页排序',
          key: 'sort'
        },
        {
          title: '文章数量',
          key: 'count'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
        }
      ],
      class_list_data: [],
      add_update: 1,
    }
  },
  watch: {
    'upload_data.class_name': function() {
      this.check_classname()
    }

  },
  created: function() {
    document.title = '分类管理'
    this.get_class_list()
  },
  methods: {
    check_classname() {
      var title = document.getElementById('input_classname')
      if (this.upload_data.class_name == this.edit_classname) {
        title.style.borderColor = ''
      } else {
        this.axios.get('class/check', {
          params: {
            class_name: this.upload_data.class_name.trim()
          }
        })
        .then(response => {
          if (response.data.data || response.data.success == false) {
            title.style.borderColor = 'red'
          } else {
            title.style.borderColor = ''
          }
        })
        .catch(error => {
          console.log(error)
        })
      }
    },
    page_num_change(page_num) {
      this.get_list_data.page_num = page_num
      this.get_class_list()
    },
    page_size_change(page_size_num) {
      this.get_list_data.class_num_per_page = page_size_num
      if (this.get_list_data.page_num == 1) {
        this.get_class_list()
      }
    },
    get_class_list() {
      axios.get('/class/list', {
        params: {
          with: 'with_count',
          page_num: this.get_list_data.page_num,
          class_num_per_page: this.get_list_data.class_num_per_page,
        }
      })
      .then(response => {
        if (response.data.success) {
          this.class_list_data = response.data.data.list_data
          this.total_class_num = response.data.data.total_class_num
        }
      })
    },
    add_class() {
      var data = this.upload_data
      this.request_post(data, 'class/add', 'add')
    },
    reset_upload() {
      this.$data.upload_data = this.$options.data().upload_data
      this.$data.add_update = this.$options.data().add_update
      this.$data.edit_classname = this.$options.data().edit_classname
    },
    edit_class(index) {
      this.$data.upload_data = this.$options.data().upload_data
      this.$data.edit_classname = this.$options.data().edit_classname

      var class_data = this.class_list_data[index]
      this.upload_data.class_id = class_data.id
      this.edit_classname = class_data.classname
      this.upload_data.class_name = class_data.classname
      this.upload_data.class_sort = class_data.sort
      this.upload_data.class_status = String(class_data.status)
      this.upload_data.class_intro = class_data.intro
      this.add_update = 2
    },
    del_class(class_id, class_name, class_count) {
      if (class_id == 1) {
        this.$Modal.warning({
          title: '基础分类',
          content: '留点东西吧, 基础类别不能删除'
        });
      } else {
        var data = {class_id: class_id, class_name: class_name}
        if (class_count > 0) {
          this.$Modal.confirm({
              title: '确认删除',
              content: '<p style="color: red">请注意: 该分类有文章使用，删除以后需要重新设置文章分类, 真的要删除吗?</p>',
              onOk: () => {
                this.request_post(data, 'class/del', 'del')
              },
              onCancel: () => {
              }
          });
        }else{
          this.request_post(data, 'class/del', 'del')
        }
      }
    },
    cancel_delete() {
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
   request_post(data, url, msg) {
      var msg_data = {
        add: ['操作完成', '操作失败'],
        del: ['删除成功', '删除失败'],
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
          if (msg == 'add') {
            this.reset_upload()
          }
          this.get_class_list()
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
  .part {
    margin-top: 50px;
  }
  .left_part {
    float: left;
    width: 35%;
    text-align: right;
  }
  .left_inner {
    background-color: white;
    float: right;
    padding: 30px 45px;
    width: max-content;
  }
  .left_part_inner {
    clear:both;
    margin-bottom: 50px;
    text-align:left;
  }
  .right_part {
    float: right;
    width: 62%;
    text-align: left;
  }
  .right_inner {
    background-color: white;
    float: left;
    padding: 30px 45px;
    width: 100%;
  }
  .right_part_inner {
    clear:both;
    margin-bottom: 50px;
    text-align:left;
  }
  .input_width {
    width: 350px;
  }
  p {
    margin-bottom: 6px;
  }
  .op_button {
    margin-left: 2px;
    margin-right: 2px;
  }
  .add_update_button {
    margin-left: 30px;
    margin-right: 30px;
  }
</style>
