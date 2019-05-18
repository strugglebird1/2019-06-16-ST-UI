<template>
  <div class="app-container">
    <div class="box" v-if="!reset">
      <p class="title">Forgot Password</p>
      <el-steps :active="active" finish-status="success">
        <el-step title="Email Verification"></el-step>
        <el-step title="Set Password"></el-step>
        <el-step title="Change Succeeded"></el-step>
      </el-steps>
      <div class="stepbox" v-if="active==0">
        <el-form
          v-if="!success"
          :model="dynamicValidateForm"
          ref="dynamicValidateForm"
          label-width="60px"
          class="demo-dynamic"
        >
          <el-form-item
            prop="email"
            label="Email"
            :rules="[
        { required: true, message: 'Please enter a correct E-mail address!', trigger: 'blur' },
        { type: 'email', message: 'Please enter a correct E-mail address!', trigger: ['blur'] }
      ]"
          >
            <el-input v-model="dynamicValidateForm.email" class="emailminput"></el-input>
          </el-form-item>
          <el-button type="primary" style="margin-top: 12px;" @click="next('dynamicValidateForm')">next</el-button>
        </el-form>
        <span v-if="success">
          <svg-icon icon-class="success"/>A verification email has been sent. Please click on the link in the email to complete the email verification.
        </span>
      </div>
      <div class="stepbox" v-if="active==1">
        <el-form
          :model="ruleForm2"
          status-icon
          :rules="rules2"
          ref="ruleForm2"
          label-width="150px"
          class="demo-ruleForm"
        >
          <el-form-item label="Password" prop="pass">
            <el-input :type="pwdtype" v-model="ruleForm2.pass" autocomplete="off" class="pwdinput"></el-input>
            <span class="show-pwd" @click="showPwd('pwdtype')">
              <svg-icon :icon-class="pwdtype === 'password' ? 'eye' : 'eye-open'"/>
            </span>
            <span class="passmsg">The password is at least 8 digits and must contain three types of combinations: uppercase letters, lowercase letters, numbers, and special symbols.</span>
          </el-form-item>
          <el-form-item label="Confirm Password" prop="checkPass">
            <el-input
              :type="checkpwdtype"
              v-model="ruleForm2.checkPass"
              autocomplete="off"
              class="pwdinput"
            ></el-input>
            <span class="show-pwd" @click="showPwd('checkpwdtype')">
              <svg-icon :icon-class="checkpwdtype === 'password' ? 'eye' : 'eye-open'"/>
            </span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm2')" class="subbmit">Submit</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="stepbox" v-if="active==2">
        <div class="step3">
          <span>
            <svg-icon icon-class="success" class="iconsucc" style="color:'#f00'"/>Change succeeded, the page will  jump to the  login page...
          </span>
          <p class="tologin">If there is no jump after 10 seconds, click the button.
            <el-button size="mini" @click="tologin">Go</el-button>
          </p>
        </div>
      </div>
    </div>
    <div class="resetbox" v-else>
      <div class="resetsecc">
        <span>
          <svg-icon icon-class="success" class="iconsucc" style="color:'#f00'"/>The secret key reset is successful and  jumps to Profile...
        </span>
        <p class="tologin">If there is no jump after 10 seconds, click the button.
          <el-button size="mini" @click="tocuspro">Go</el-button>
        </p>
      </div>
    </div>
    <div class="goback" @click="tologin" v-if='active===0'><svg-icon icon-class="goback" /></div>
  </div>
</template>
<script>
import { emailForget, forgetChange } from "@/api/emailInit";
import { comreset } from "@/api/reset";
import { removeToken, removeState, removeRoleID } from "@/utils/auth";
import { isPassword } from "@/utils/index";
import store from "@/store";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password!"));
      } else if(!isPassword(value)){
        callback(new Error("Please enter the correct password!"));
      }else{
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password again!"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("Inconsistent passwords. Please re-enter!"));
      } else {
        callback();
      }
    };
    return {
      active: 0,
      success: 0,
      pwdtype:'password',
      checkpwdtype:'password',
      dynamicValidateForm: {
        email: ""
      },
      ruleForm2: {
        pass: "",
        checkPass: ""
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      reset: 0,
      timeout:null,
      code_route:{}
    };
  },
  created() {
    this.status();
  },
  destroyed(){
    clearTimeout(this.timeout)
  },
  methods: {
    next(formName) {
      // if (this.active++ > 2) this.active = 0;
      this.$refs[formName].validate(valid => {
        if (valid) {
        if (this.active == 0) {
          const data = this.dynamicValidateForm;
          if (this.active == 0) {
            emailForget(data).then(Response => {
              if(Response.data.code === 0){
                this.success = 1;
              }else{
                 this.$message.error(Response.data.msg);
              }
            });
          }
        }
        }else{
          
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = {};
          data.userId = this.code_route.userId;
          data.code = this.code_route.code;
          data.password = this.ruleForm2.pass;
          forgetChange(data).then(Response => {
            if (Response.data.code === 0) {
              this.active = 2;
              this.$message({
                message: "Change succeeded!",
                type: "success"
              });
              removeToken();
              this.timeout =setTimeout(()=>{
                this.$router.push({ path: "/login" });
              },1000*10)
            } else {
              this.$message({
                message: "Failure",
                type: "info"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    status() {
      this.code_route = JSON.parse(this.$route.query.code_route)
      if(this.code_route){
        if(this.code_route.action==='reset_secret'){
          // 秘钥重置成功 
          this.reset = 1
          this.timeout =setTimeout(()=>{
            this.$router.push({ path: "/cusprofile" })
            // location.reload(); 
          },1000*10)
        } else if(this.code_route.action==='reset_password') {
          this.active = 1
        }
      }else{
          this.active = 0 
      }
      // if(store.custId){
      //   this.reset = 1
      //   const data = {}
      //   data.code = this.code_router.code
      //   data.custId = store.custId
      //   data.userId = this.code_router.userId
      //   comreset(data).then(res => {
      //     if(res.data.msg==='OK'){
      //       this.$router.push({ path: "/cusprofile" })
      //     }
      //   })
      // }else if (this.code_router.code) {
      //   this.active = 1
      // }else{
      //   this.active = 0 
      // }
    },
    tologin() {
      removeToken();
      this.$router.push({ path: "/login" });
    },
    tocuspro(){
      this.$router.push({ path: "/cusprofile" });
    },
    showPwd(inputname) {
      if (this[inputname] === "password") {
        this[inputname] = "";
      } else {
        this[inputname] = "password";
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
.box {
  width: 50%;
  margin-left: 50%;
  margin-top: 7%;
  transform: translate(-50%);
  .title {
    font-size: 30px;
    text-align: center;
    padding: 10px;
  }
}
.demo-dynamic {
  width: 50%;
  margin: 0 auto;
  text-align: center;
}
.demo-ruleForm {
  width: 600px;
  margin: 0 auto;
  .pwdinput {
    width: 340px;
  }
}
.stepbox {
  width: 90%;
  padding-top: 30px;
  margin: 0 auto;
  .el-input__suffix {
    color: #c0c4cc;
  }
  .forminput {
    width: 98%;
  }
  .tologin {
    font-size: 11px;
    padding-left: 30px;
  }
  .emailminput {
    width: 98%;
  }
}
.step3 {
  margin: 3% 25%;
  width: 100%;
}
.resetsecc {
  width: 500px;
  margin: 15% auto;
}
.goback{
  width: 25px;
  height: 25px;
  position: relative;
  left: 500px;
  top: 30px;
  font-size: 20px;
  cursor: pointer;
}
.subbmit{
  margin-left: 100px;
}
.passmsg{
  position:absolute;
  width: 300px;
  font-size: 12px;
  line-height: 12px;
  padding-left: 10px;
  color: #999999;
}
 .show-pwd {
    position: absolute;
    right: 135px;
    top: 2px;
    font-size: 16px;
    color: gray;
    cursor: pointer;
    user-select: none;
  }
</style>
