<template>
  <div class='app-container'>
    <span class="tips">China: for Uniform Social Credit Code, please check on web https://www.cods.org.cn/.&nbsp;&nbsp;&nbsp;
              Japan: かいしゃほうじんとうばんごう, Check on web http://www.houjin-bangou.nta.go.jp/
    </span>
    <el-form
      :model='dynamicValidateForm'
      ref='dynamicValidateForm'
      label-width='250px'
      class='demo-dynamic'
      :rules="rules"
    >
      <el-form-item
        prop='email'
        label='Email'
        required
      >
        <el-input v-model='dynamicValidateForm.email'></el-input>
      </el-form-item>
      <p class="formcom">Company Information</p>
      <el-form-item
        prop='company'
        label='Company Name'
      >
        <el-input v-model='dynamicValidateForm.company'></el-input>
      </el-form-item>
      <el-form-item
        prop='registration'
        label='Registration Country'
        required
      >
        <el-select v-model="dynamicValidateForm.registration" placeholder="Registration Country" class="selchin">
          <el-option label="Japan" value="1"></el-option>
          <el-option label="China" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop='companycode'
        label='Company Code'
        required
      >
        <el-input v-model='dynamicValidateForm.companycode'></el-input>
        
      </el-form-item>
      <el-form-item
        prop='industry'
        label='Business Industry'
        required
      >
        <el-select v-model="dynamicValidateForm.industry" placeholder="Business Industry" class="selchin">
          <el-option label="Computer/Internet/Communication/Electronics" value="1"></el-option>
          <el-option label="Accounting/Finance/Banking/Insurance" value="2"></el-option>
          <el-option label="Trade/Consumption/Manufacturing/Operation" value="3"></el-option>
          <el-option label="Pharmacy/Medical Care" value="4"></el-option>
          <el-option label="Advertising/Media" value="5"></el-option>
          <el-option label="Real Estate/Construction" value="6"></el-option>
          <el-option label="Professional Services/Education/Training" value="7"></el-option>
          <el-option label="Service Sector" value="8"></el-option>
          <el-option label="Logistics/Transportation" value="9"></el-option>
          <el-option label="Energy/Raw Materials" value="10"></el-option>
          <el-option label="Government/Nonprofit Organization/Others" value="11"></el-option>
        </el-select>
      </el-form-item><el-form-item
        prop='companysize'
        label='Company Size(employees)'
        required
      >
        <el-select v-model="dynamicValidateForm.companysize" placeholder="Company Size" class="selchin">
          <el-option label="<500" value="1"></el-option>
          <el-option label="500-1000" value="2"></el-option>
          <el-option label="1000-5000" value="3"></el-option>
          <el-option label=">5000" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Telephone"  required>
            <el-col :span="9">
              <el-form-item prop="country">
                <el-select v-model="dynamicValidateForm.country" placeholder="country">
                  <el-option label="+86(China)" value="86"></el-option>
                  <el-option label="+81(Japan)" value="81"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="0.5">-</el-col>
            <el-col :span="6">
              <el-form-item prop="areacode">
                <el-input v-model="dynamicValidateForm.areacode" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="0.5">-</el-col>
            <el-col :span="8">
              <el-form-item prop="phone">
                <el-input v-model="dynamicValidateForm.phone" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <span class="phonemsg">{{phonemsg}}</span>
        </el-form-item>
      <el-form-item
        prop='contactname'
        label='Contact Person'
      >
        <el-input v-model='dynamicValidateForm.contactname'></el-input>
      </el-form-item><el-form-item
        prop='address'
        label='Address'
      >
        <el-input v-model='dynamicValidateForm.address'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='submitForm("dynamicValidateForm")' class='submit'>Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { setCustomer } from '@/api/creat';

export default {
  data() {
    var ckcompanycode = (rule, value, callback) => {
      const registration = this.dynamicValidateForm.registration;
      if(value===''){
        callback(new Error('Please enter a correct Company Code!'));
      }else if(registration==='1'){
        if(!/^\d{12}$/.test(value)){
          callback(new Error('Please enter a correct Company Code!'));
        }else{
        callback()
        }
      }else if(registration==='2'){
        if(!/^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/.test(value)){
          callback(new Error('Please enter a correct Company Code!'));
        }else{
        callback()
        }
      }
    }
    var ckareacode = (rule, value, callback) => {
      if(value===''){
        this.phonemsg='Please enter a correct telephone number!'
        callback(new Error(' '));
      }else if(!/^\d{3,4}$/.test(value)){
        this.phonemsg='Please enter a correct telephone number!'
         callback(new Error(' '));
      }else{
        this.phonemsg=''
        callback()
      }
    }
    var ckphone = (rule, value, callback) => {
      if(value===''){
        this.phonemsg='Please enter a correct telephone number!'
        callback(new Error(' '));
      }else if(!/^\d{8}$/.test(value)){
        this.phonemsg='Please enter a correct telephone number!'
         callback(new Error(' '));
      }else{
        this.phonemsg=''
        callback()
      }
    }
    var ckcontactname =(rule, value, callback) => {
      if(value.trim()===''){
        callback(new Error("Input can't be empty!"));
      }else if(value.trim().length>50){
         callback(new Error('Maximum length limit of 50 characters!'));
      }else{
        callback()
      }
    }
    return {
      phonemsg:'',
      dynamicValidateForm: {
        email: '',
        company: '',
        registration: '',
        companycode: '',
        industry:'',
        companysize:'',
        country:'81',
        areacode: '',
        phone:'',
        contactname:'',
        address:''
      },
      options: [
        {
          value: '3',
        }
      ],
      rules:{
        email:[
          { required: true, message: "Please enter a correct E-mail address!", trigger: "blur" },
          { type: "email", message: "Please enter a correct E-mail address!", trigger: ["blur"] }
        ],
        company: [
          { required: true, validator: ckcontactname, trigger: 'blur' },
        ],
        registration:[
          { required: true, message: 'Please select a Registration Country!', trigger: 'blur' },
        ],
        companycode:[
          { validator: ckcompanycode, trigger: ['blur','change'] }
        ],
        industry:[
          { required: true, message: 'Please select a Business Industry!', trigger: 'change' }
        ],
        companysize:[
          { required: true, message: 'Please select a Company Size!', trigger: 'change' }
        ],
        country:[
           { required: true, message: 'country', trigger: 'change' }
        ],
        areacode:[
            { validator: ckareacode, trigger: 'blur' }
        ],
        phone:[
            { validator: ckphone, trigger: 'blur' }
        ],
        contactname: [
          { required: true, validator: ckcontactname, trigger: 'blur' },
        ],
        address: [
          { required: true, validator: ckcontactname, trigger: 'blur' },
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data ={
            email : this.dynamicValidateForm.email,
            name : this.dynamicValidateForm.company,
            registration : this.dynamicValidateForm.registration,
            companyCode : this.dynamicValidateForm.companycode,
            industry : this.dynamicValidateForm.industry,
            companySize : this.dynamicValidateForm.companysize,
            telephone : this.dynamicValidateForm.country+'-'+this.dynamicValidateForm.areacode+'-'+this.dynamicValidateForm.phone,
            contactName : this.dynamicValidateForm.contactname,
            address : this.dynamicValidateForm.address
          }
          setCustomer(data).then(Response => {
              if(Response.data.code === 0){
                this.$message({
                   message: 'Created Successfully!',
                   type: 'success'
                 });
                 const time = new Date().getTime()
                 this.$router.push({ path: '/customer/list', query: {time} })
              }else{
                 this.$message.error(Response.data.msg);
              }
          });
        } else {
           if(!/^\d{3,4}$/.test(this.dynamicValidateForm.areacode)){
              this.phonemsg='Please enter a correct telephone number!'
            }
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
  overflow :auto;
  background-color: #fff !important;
  .demo-dynamic {
    width: 700px;
    padding: 30px 50px;
    .formcom{
      font-size: 20px;
      margin-left: 100px;
    }
    .selch{
      width: 160px;
    }
    .selchin{
      width: 350px;
    }
    .submit{
      margin-left: 120px;
    }
  }
   .tips{
      position:absolute;
      left: 690px;
      top: 285px;
      width: 500px;
      font-size: 12px;
      color: #aaa;
    }
    .phonemsg{
      color: #F56C6C;
      position:absolute;
      font-size: 12px;
      top: 30px;
      left: 0;
    }
}
</style>
