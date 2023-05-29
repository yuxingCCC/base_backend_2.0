<template>
	<el-popover placement="right"  trigger="manual" width="450" v-model="show">
		<FuncList />
		<div @click.stop="handClick" slot="reference" id="auto_box"></div>
	</el-popover>
</template>

<script>
import FuncList from "./funcList/FuncList.vue";
export default {
	components: {
		FuncList,
	},
	name: "Automation",
	created() {},
	mounted() {
		this.drag();
	},
	data() {
		return {
			timer: null,
			show: false,
		};
	},
	methods: {
		handClick() {
			if (this.timer) {
				this.show = true;
				clearTimeout(this.timer);
				this.timer = null;

                return
			}
			this.timer = setTimeout(() => {
				clearTimeout(this.timer);
				this.show = false;
				this.timer = null;
			}, 200);
		},
		drag() {
			var drag = document.getElementById("auto_box");
			drag.onmousedown = function(e) {
				var e = e || window.event; // 兼容ie浏览器
				var diffX = e.clientX - drag.offsetLeft;
				var diffY = e.clientY - drag.offsetTop;
				if (typeof drag.setCapture !== "undefined") {
					drag.setCapture();
				}
				document.onmousemove = function(e) {
					var e = e || window.event; // 兼容ie浏览器
					var left = e.clientX - diffX;
					var top = e.clientY - diffY;
					if (left < 0) {
						left = 0;
					} else if (left > window.innerWidth - drag.offsetWidth) {
						left = window.innerWidth - drag.offsetWidth;
					}
					if (top < 0) {
						top = 0;
					} else if (top > window.innerHeight - drag.offsetHeight) {
						top = window.innerHeight - drag.offsetHeight;
					}
					drag.style.left = left + "px";
					drag.style.top = top + "px";
				};
				document.onmouseup = function(e) {
					this.onmousemove = null;
					this.onmouseup = null;
					if (typeof drag.releaseCapture !== "undefined") {
						drag.releaseCapture();
					}
				};
			};
			document.addEventListener("click", (e) => {
				this.show = false;
			});
		},
	},
};
</script>

<style lang="scss">
#auto_box {
	position: fixed; /*设置绝对定位，脱离文档流，便于拖拽*/
	display: block;
	border-radius: 50%;
	width: 50px;
	height: 50px;
	box-shadow: 2px 2px 8px #666;
	cursor: move; /*鼠标呈拖拽状*/
	z-index: 1888;
user-select:none;
	display: flex;
	align-items: center;
	justify-content: center;
	background-image: url("../../assets/img/dashan.png");
	background-color: #ffffffcc;
	background-size: 65% 65%;
	background-position: 50%;
	background-repeat: no-repeat;
	right: 50%;
	top: 50%;
}
</style>
