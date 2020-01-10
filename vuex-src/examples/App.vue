<template>
  <div>
    <h1>Vuex模板{{count}}</h1>
    <button @click="handleClick">click</button>
  </div>
</template>

<script>
export default {
  computed: {
    count () {
      return this.$store.state.app.count
    }
  },
  mounted () {
    console.log('sub', this)
  },
  methods: {
    handleClick () {
      this.$store.commit('ADD_COUNT')
    }
  }
}
</script>

<style>

</style>