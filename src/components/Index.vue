<template>
  <div>
    <Button>Default</Button>
    <Button type="primary" @click="get_key()">Primary</Button>
    <Button type="dashed">Dashed</Button>
    <Button type="text">Text</Button>
    <br><br>
    <Button type="info">Info</Button>
    <Button type="success">Success</Button>
    <Button type="warning">Warning</Button>
    <Button type="error">Error</Button>
    <p>key is: {{login_key}} </p>
  </div>
</template>

<script>

export default {
  data () {
    return {
      login_key: 'abc',
    }
  },
  methods: {
    get_key: function() {
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
