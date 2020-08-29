<template>
  <div>
    <Drawer title="Basic Drawer" 
      :closable="false" 
      v-model="pub_show"
      :mask-closable="false"
    >
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="$emit('pub-show', false)">取消</Button>
        <Button type="primary" @click="pub_value.show = false">发布</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>

export default {
  name: 'publish',
  data () {
    return {
    }
  },
  watch: {
  },
  props: {
    pub_show: Boolean,
  },
  created: function() {
    document.title = '仪表板'
  },
  methods: {
  }
}
</script>