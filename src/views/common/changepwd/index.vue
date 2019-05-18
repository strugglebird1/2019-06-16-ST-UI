<template>
  <div class="app-container">
    <div class="stepbox">
      <el-form
        :model="ruleForm2"
        status-icon
        :rules="rules2"
        ref="ruleForm2"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="Original Password" prop="oldpass" required>
          <el-input :type="oldpwdType" v-model="ruleForm2.oldpass" autocomplete="off" class="pwdinput">
          </el-input>
           <span class="show-pwd" @click="showPwd('oldpwdType')">
              <svg-icon :icon-class="oldpwdType === 'password' ? 'eye' : 'eye-open'"/>
            </span>
          <span
            class="passmsg"
          >The password is at least 8 digits and must contain three types of combinations: uppercase letters, lowercase letters, numbers, and special symbols.</span>
        </el-form-item>
        <el-form-item label="New Password" prop="pass" required>
          <el-input :type="newpwdType" v-model="ruleForm2.pass" autocomplete="off" class="pwdinput"></el-input>
          <span class="show-pwd" @click="showPwd('newpwdType')">
              <svg-icon :icon-class="newpwdType === 'password' ? 'eye' : 'eye-open'"/>
            </span>
        </el-form-item>
        <el-form-item label="Confirm Password" prop="checkPass" required>
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
          <el-button type="primary" @click="submitForm('ruleForm2')" class="submit">Submit</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { updata } from "@/api/updata";
import { changepwd } from "@/api/changepwd";
import { removeToken, removeState, removeRoleID } from "@/utils/auth";
import { mapGetters, Store } from "vuex";
import store from "@/store";
import { isPassword } from "@/utils/index";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password!"));
      } else if (!isPassword(value)) {
        callback(new Error("Please enter the correct password!"));
      } else {
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
      oldpwdType: "password",
      newpwdType: "password",
      checkpwdtype:"password",
      dynamicValidateForm: {
        email: store.getters.email
      },
      ruleForm2: {
        oldpass:'',
        pass: '',
        checkPass: ''
      },
      rules2: {
        oldpass: [{ validator: validatePass, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  created() {},
  computed: {
    ...mapGetters(["email"])
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = {};
          data.oldPwd = this.ruleForm2.oldpass;
          data.newPwd = this.ruleForm2.pass;
          data.newPwdConform = this.ruleForm2.checkPass;
          changepwd(data).then(Response => {
            if (Response.data.code === 0) {
              this.$message({
                message: "Change succeeded!",
                type: "success"
              });
              removeToken();
              this.$router.push({ path: "/login" });
            } else {
              this.$message({
                message: Response.data.msg,
                type: "error"
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
    tologin() {
      removeToken();
      this.$router.push({ path: "/login" });
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
  padding-top: 100px;
}
// .demo-dynamic{
//   width: 100%;
//   margin: 0 auto;
//   text-align: center;
//   .el-button{
//     margin-top: 20px !important;
//   }
// }
.demo-dynamic {
  width: 50%;
  margin: 0 auto;
  text-align: center;
  .emailinput {
    width: 250px;
    margin-right: 100px;
  }
}
.demo-ruleForm {
  width: 600px;
  margin: 0 auto;
  .pwdinput {
    width: 340px;
  }
}
.steps {
  width: 40%;
  margin: 0 auto;
}
.stepbox {
  padding-top: 30px;
  width: 60%;
  margin: 0 auto;
}
.passmsg{
  position:absolute;
  width: 300px;
  font-size: 12px;
  line-height: 12px;
  padding-left: 10px;
  color: #999999;
}
.submit{
  margin-left:110px;
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
