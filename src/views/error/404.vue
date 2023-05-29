<template>
  <div id="notFind">
    <div class="container">
      <img src="@/assets/img/404.png" class="bg" />
      <!--科技以换壳为本-->
      <div class="btn">
        <a @click="$router.push('/')" class="goindex">回到首页</a>
        <a
          @click="back"
          target="_blank"
          class="lx"
          >返回上一页</a
        >
        <div style="clear: both"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    console.log(this.$router)
  },
  methods: {
    back() {
      window.history.go(-1);
    }
  }
}
</script>

<style>
#notFind img {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
#notFind .container {
  max-width: 90%;
  margin: 0 auto;
  padding: 80px 0px;
}
#notFind .bg {
  display: block;
  max-width: 100%;
  margin: 0px auto;
}
#notFind .btn {
  width: 400px;
  margin: 0 auto;
  max-width: 100%;
  margin-top: 40px;
  display: flex;
}
#notFind .btn a {
	text-decoration: none;
	width: 46.5%;
	border: 1px solid #5298ff;
	background: #5298ff;
	color: #fff;
	display: block;
	height: 46px;
	line-height: 44px;
	text-align: center;
	font-size: 16px;
	border-radius: 3px;
	overflow: hidden;
	cursor: pointer;
}
#notFind .btn .goindex {
  margin-right: 7%;
}
#notFind .btn .lx {
  border: 1px solid #d8d8d8;
  background: #ffffff;
  color: #8c8c8c;
}
@media screen and (max-width: 500px) {
  .btn {
	width: 85%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
  }
  .btn a {
    width: 100%;
    font-size: 15px;
    height: 42px;
	line-height: 42px;
  }
  .btn .goindex {
    margin-right: 0 !important;
    margin-bottom: 20px;
  }
}
</style>