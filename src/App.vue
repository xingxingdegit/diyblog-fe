<template>
  <div class="layout">
    <Layout>
      <Header style="position: static, width: 100%;z-index: 1000;">
        <Menu mode="horizontal" @on-select="menu_decide" theme="dark" active-name="1">
          <div class="layout-logo">Dashboard</div>
          <div class="layout-nav">
            <MenuItem name="Dashboard">
                <Icon type="md-speedometer" />
                仪表盘
            </MenuItem>
            <Submenu name="posts">
                <template slot="title">
                    <Icon type="ios-create" />
                    文章
                </template>
                <MenuItem name="PostHandler">写文章</MenuItem>
                <MenuItem name="PostShow">所有文章</MenuItem>
            </Submenu>
            <MenuItem name="Attach">
                <Icon type="md-attach" />
                附件
            </MenuItem>
            <Submenu name="class">
                <template slot="title">
                    <Icon type="md-albums" />
                    分类
                </template>
                <MenuItem name="class">分类</MenuItem>
                <MenuItem name="tags">标签</MenuItem>
            </Submenu>
            <MenuItem name="Setting">
                <Icon type="ios-construct" />
                综合设置
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Content style="background: #f7f7f7; minHeight: 500px; padding: 0 5%; margin-bottom: 50px;">
        <component :reset_data="reset_data" id="content" @put_event="put_event" v-bind:is="currentComponent" />
      </Content>
      <Footer class="layout-footer-center">
        Hello World
      </Footer>
    </Layout>
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue'
import PostHandler from './components/PostHandler.vue'
import PostShow from './components/PostShow.vue'
export default {
  name: 'app',
  data () {
    return {
      currentComponent: '',
      reset_data: 0,
    }
  },
  components: {
    Dashboard,
    PostHandler,
    PostShow,
  },
  created: function () {
    var component = document.location.hash.split('/')[0] || '#Dashboard'
    this.currentComponent = component.slice(1)
  },
  methods: {
    menu_decide: function(menuName) {
      if (this.currentComponent == 'PostHandler') {
        this.$Modal.confirm({
          title: '确认离开吗?',
          content: '<p style="color: red"> 注意：离开会使未保存的文档丢失!</p>',
          okText: '离开',
          onOk: () => {
            document.location.hash = menuName
            this.currentComponent = menuName
            this.reset_component(menuName)
          },
          onCancel: () => {
            this.$Message.info('已取消');
          }
        });
      } else {
        document.location.hash = menuName
        this.currentComponent = menuName
        this.reset_component(menuName)
      }
    },
    put_event: function(component_name) {
      this.currentComponent = component_name
      this.reset_component(component_name)
    },
    reset_component: function(com_name) {
      if (com_name == this.currentComponent) {
        this.reset_data += 1
      }
    }
  }
}
</script>


<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-logo{
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }
    .layout-nav{
        width: 600px;
        margin: 0 auto;
    }
    .layout-footer-center{
        text-align: center;
    }
</style>