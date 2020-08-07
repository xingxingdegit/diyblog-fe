<template>
  <div>
  </div>
</template>

<script>

export default {
  name: 'PostShow',
  data () {
    return {
      login_key: 'abc',
      post_title: '',
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
    }
  }
}
</script>