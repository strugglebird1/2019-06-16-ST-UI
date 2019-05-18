<template>
  <div id="app" @mouseover="OperatingWebsite()">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
    methods:{
      OperatingWebsite() {
        let currentTime = this.currentTime;
        let lastTime = new Date().getTime();
        let timeOut = 30 * 60 * 1000; //设置时间 30分钟
        if (lastTime - currentTime > timeOut) {
          // 未操作页面，跳转登录页面
          this.currentTime = new Date().getTime(); 
          this.$store.dispatch('LogOut').then(() => {
            this.$router.push({ path: '/login' })
            this.$message({
              message: 'Login timeout!',
              type: 'warning'
            });
          })
        } else {
          this.currentTime = new Date().getTime(); 
        }
      }
    }
}
</script>
