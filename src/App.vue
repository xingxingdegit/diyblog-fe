<template>
  <div class="layout">
    <Layout>
      <Header :style="{position: 'fixed', width: '100%'}">
        <Menu mode="horizontal" @on-select="menu_decide" theme="dark" active-name="1">
          <div class="layout-logo">Dashboard</div>
          <div class="layout-nav">
            <MenuItem name="dashboard">
                <Icon type="md-speedometer" />
                仪表盘
            </MenuItem>
            <Submenu name="posts">
                <template slot="title">
                    <Icon type="ios-create" />
                    文章
                </template>
                <MenuItem name="posts_show">写文章</MenuItem>
                <MenuItem name="posts_create">所有文章</MenuItem>
            </Submenu>
            <Submenu name="class">
                <template slot="title">
                    <Icon type="md-albums" />
                    分类
                </template>
                <MenuItem name="class">分类</MenuItem>
                <MenuItem name="tags">标签</MenuItem>
            </Submenu>
            <MenuItem name="setting">
                <Icon type="ios-construct" />
                综合设置
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Content :style="{margin: '88px 20px 0', background: '#fff', minHeight: '500px'}">
        Content
        <component v-bind:is="currentComponent" />
      </Content>
      <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer>
    </Layout>
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue'
export default {
  name: 'app',
  data () {
    return {
      currentComponent: 'Dashboard',
      theme1: 'dark'
    }
  },
  components: {
    Dashboard,
  },
  methods: {
    menu_decide: function(menuName) {
      console.log(menuName)
      this.currentComponent = menuName
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
        width: 420px;
        margin: 0 auto;
    }
    .layout-footer-center{
        text-align: center;
    }
</style>