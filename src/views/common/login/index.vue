<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <h1 class="title">
        VID Platform
      </h1>
      <el-form-item>
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input v-model="loginForm.email" auto-complete="on" placeholder="email"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="password"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >Log in</el-button>
      </el-form-item>
      <div class="tips">
        <span style="margin-right:20px;" @click="toforgot">Forgot Password？</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { isPassword } from "@/utils/index";
import { getSysID, getOpeID,removeSysID, removeOpeID, removeState } from "@/utils/auth";
export default {
  name: "Login",
  data() {
    const validatePass = (rule, value, callback) => {
      const reg =/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      if (isPassword(value) && (reg.test(this.loginForm.email))) {
        callback();
      } else {
          callback(new Error("Your Email or password is incorrect. Please re-enter!"));
      }
    };
    return {
      loginForm: {
        email: "",
        password: ""
      },
      loginRules: {
        email: [
          {
            required: true,
            message: "Please enter a correct E-mail address!",
            trigger: "blur"
          },
          {
            type: "email",
            message: "Please enter a correct E-mail address!",
            trigger: "blur"
          }
        ],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      pwdType: "password",
      redirect: undefined
    };
  },
  created(){
    this.clearlog()
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(res => {
              var msg = res.data.msg
              this.loading = false;
              if (res.data.msg === "OK") {
                this.$message({
                  message: "welcome",
                  type: "success"
                });
                this.$router.push({ path: this.redirect || "/" });
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch((res) => {
             
            });
        } else {
          return false;
        }
      });
    },
    toforgot() {
      this.$router.push({ path: "/forgot" });
    },
    clearlog(){
      removeState()
      if(getSysID()){
        removeSysID()
        removeOpeID()
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
        -moz-box-shadow: 0 0 0px 1000px $bg inset !important;
        -o-box-shodow: 0 0 0px 1000px $bg inset !important;
        box-shadow: 0 0 0px 1000px $bg inset !important;
      }
      &::-webkit-input-placeholder { /* WebKit browsers */
            color: rgba(246,250,253, 0.1);
        }
        &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
            color: rgba(246,250,253, 0.1);
        }
        &::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: rgba(246,250,253, 0.1);
        }
        &:-ms-input-placeholder { /* Internet Explorer 10+ */
            color:  rgba(246,250,253, 0.1);
        }

    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
   
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
        cursor: pointer;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-weight: 400;
    font-size: 45px;
    color: $light_gray;
    margin: 40px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
