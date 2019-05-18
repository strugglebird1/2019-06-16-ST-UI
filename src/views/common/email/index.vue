<template>
  <div class="app-container"></div>
</template>
<script>
import { emailForget, forgetChange, code_router } from "@/api/emailInit";
import { comreset } from "@/api/reset";
import { removeToken, removeState, removeRoleID } from "@/utils/auth";
import { isPassword } from "@/utils/index";
import store from "@/store";
export default {
  data() {
    return {};
  },
  created() {
    this.getemailaction();
  },
  destroyed() {},
  methods: {
    getemailaction() {
      if (store.code) {
        const code = store.code;
        code_router({ code }).then(res => {
          if (res.data.msg === "OK") {
            const code_route = JSON.stringify(res.data.data.code_route);
            if (res.data.data.code_route.action !== "amdin_bind_email") {
              this.$router.push({ path: "/forgot", query: { code_route } });
            } else {
              this.$router.push({ path: "/admin", query: { code_route } });
            }
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }else{
        this.$router.push({ path: "/login"});
      }
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.app-container {
  width: 100%;
  height: 100%;
  background-color: #eee;
}
</style>
