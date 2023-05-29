<template>
	<div>
		<div class="hitokoto">
			<!-- <img src="https://unsplash.it/1600/900?random" alt=""> -->
			<div class="title">欢迎登录!</div>
			<div class="content">{{hitokoto.hitokoto}}</div>
			<div class="author">--{{hitokoto.from}}</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				hitokoto: {}
			}
		},
		created() {
			this.$axios.get('https://international.v1.hitokoto.cn/?c=d&c=i&c=j').then( (res)=>{
				this.hitokoto = res.data;
			}).catch((error) => {
				console.log(error);
			})
		}
	}
</script>

<style>

</style>

<style lang="scss" scoped>
.hitokoto {
    background: #fff;
    position: relative;
    width: 80%;
    min-width: auto;
    margin: 0 auto;
    margin-top: 50px;
    padding: 30px;
    box-sizing: border-box;
    color: #666666;
    font-family: '楷体';
}
.hitokoto img {
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	object-fit: cover;
	opacity: 0.2;
	z-index: 0;
}
.hitokoto div {
	position: relative;
	z-index: 1;
}
.hitokoto .title {
    margin-bottom: 20px;
}
.hitokoto .author {
    text-align: right;
    margin-top: 20px;
}
.hitokoto::before {
    content: ' ';
    position: absolute;
    width: calc(100% + 40px);
    height: calc(100% + 40px);
    background: rgba(255, 255, 255, 0.5);
    top: -20px;
    left: -20px;
    z-index: -1;
}
</style>
