<template>
  <div class="app-container">
    <router-view class="routerview" />
  </div>
</template>
<script>
import { updata } from "@/api/updata";
import { initUser } from "@/api/emailInit";
import { removeToken, removeState, removeRoleID } from "@/utils/auth";
import store from "@/store";
export default {
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.app-container {
  
}
.routerview {
  position: absolute;
  top: 10px;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  background: #fff;
  height: 100vh;
}
</style>
