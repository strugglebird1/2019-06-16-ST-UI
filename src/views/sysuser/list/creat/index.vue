<template>
  <div class='app-container'>
    <el-form
      :model='dynamicValidateForm'
      ref='dynamicValidateForm'
      label-width='100px'
      class='demo-dynamic'
    >
      <el-form-item
        prop='email'
        label='Email'
        :rules='[
          { required: true, message: "Please enter a correct E-mail address!", trigger: "blur" },
          { type: "email", message: "Please enter a correct E-mail address!", trigger: ["blur"] }
        ]'
      >
        <el-input v-model='dynamicValidateForm.email'></el-input>
      </el-form-item>
      <el-form-item prop='roleId' label='Role' :rules='[
          { required: true, message: "", trigger: "change" }
        ]'>
        <el-select v-model='dynamicValidateForm.roleId' placeholder='Please choose'>
          <el-option
            v-for='item in options'
            :key='item.value'
            :label='roles[item.value]'
            :value='item.value'
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='submitForm("dynamicValidateForm")' class="submit">submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { setPerson } from '@/api/creat';
import { getRoleID } from '@/utils/auth'
export default {
  data() {
    return {
      roles:{
        "2" : 'Operator Admin',
        "3" : 'Operator'
      },
      dynamicValidateForm: {
        roleId: Number(getRoleID())+1,
        email: '',
      },
      options: [
        {
          value: Number(getRoleID())+1,
        }
      ]
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = this.dynamicValidateForm;
          setPerson(data).then(Response => {
            // console.log('Response',Response)
            if(Response.data.code === 0 ){
                this.$message({
                   message: 'Created Successfully!',
                   type: 'success'
                 });
                 const time = new Date().getTime()
                 this.$router.push({ path: '/sysuser/list', query: {time} })
              }else{
                 this.$message.error(Response.data.msg);
            }
            // if(Response.data.msg==='Login name already exists'){
            //   this.$message.error('error,Login name already exists');
            // }else{
            //   this.$message({
            //     message: 'Created Successfully',
            //     type: 'success'
            //   });
            //   const time = new Date().getTime()
            //   this.$router.push({ path: '/sysuser/list', query: {time} })
            // }
          });
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.app-container {
  width: 100%;
  .demo-dynamic {
    width: 400px;
    margin: 20px 30px;
    .el-select{
      width: 300px;
    }
    .submit{
      margin-left: 100px;
    }
  }
}
</style>
