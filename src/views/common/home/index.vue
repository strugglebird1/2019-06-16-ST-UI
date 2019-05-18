<template>
  <div class="dashboard-container" v-if="roleId">
    <div v-if="roleId<4">
      <span class="welcome"> Welcome</span>
     <p class="homep">{{name}}</p>
    </div> 
    <div v-else>
     <span class="welcome"> Welcome</span>
     <p class="homep">{{company}}</p>
     <p class="homep">{{name}}</p> 
    </div>
    <div class="logoindex">
    </div>
  </div>
</template>

<script>
import { mapGetters, Store } from 'vuex'
import store from '@/store'
import { updata } from "@/api/updata"
import { getRoleID, getOpeID, getSysID, removeSysID } from "@/utils/auth"
export default {
  name: 'Home',
  computed: {
    ...mapGetters([
      'name',
      'company'
    ]),
    roleId(){
      return getRoleID()
    }
  },
  created(){
    this.tocusomerlist()
  },
  methods:{
     tocusomerlist(){
       if(getSysID()){
         if(!getOpeID()){
           this.$router.push({ path: '/customer/list' })
           removeSysID()
         }else{
           this.$router.push({ path: '/' })
         }
       }
     }
  },
  // beforeRouteEnter (to, from, next) {
  //     if(from.path==='/'){}
  //     next()
  //   }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    width: 100%;
    height: 100%;
    position: relative;
  }
}
 .logoindex{
    opacity:0.2;
    position: absolute;
    top: 0;
    left: 0;
    right:0;
    bottom: 0;
    text-align: center;
    img{
      width: 300px;
      height: 80px;
      margin-top: 15%;

    }
  }
  .welcome{
    font-size: 40px;
  }
  .homep{
    font-size: 25px;
    padding-left: 180px;
  }
</style>
