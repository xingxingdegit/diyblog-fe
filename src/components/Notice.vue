<template>
  <div>
  </div>
</template>

<script>

export default {
  name: 'Setting',
  data () {
    return {
      login_key: 'abc',
      post_title: '',
    }
  },
  created: function() {
    document.title = '设置'
  },
  methods: {
    check_title: function() {
      this.axios.get('getkey')
        .then(response => {
          this.login_key = response.data.data
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
<style scoped>
</style>