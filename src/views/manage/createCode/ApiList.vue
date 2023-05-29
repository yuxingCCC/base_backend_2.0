<template>
	<div>
		<main-content> </main-content>

		<main-content>
			<el-form :inline="true">
				<el-form-item label="接口名称">
					<el-input v-model="parmas.name" placeholder="搜索接口名称"></el-input>
				</el-form-item>
				<el-form-item label="接口">
					<el-input v-model="parmas.url" placeholder="搜索接口"></el-input>
				</el-form-item>
				<!-- <el-form-item label="baseUrl">
					<el-input v-model="parmas.baseUrl" placeholder="用于过滤baseurl"></el-input>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
			<el-card shadow="always" :body-style="{ padding: '20px' }">
				<div slot="header">
					<span><!-- card title --></span>
				</div>
				<el-table
					v-if="tableData.length"
					:data="tableData"
					:border="true"
					style="width: 100%"
					default-expand-all
					row-key="id"
					:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
				>
					<el-table-column width="50px" label="#" fixed> </el-table-column>
					<el-table-column prop="name" label="名称"> </el-table-column>
					<el-table-column prop="urlName" label="接口" align="center"> </el-table-column>
					<el-table-column prop="" label="操作" align="center">
						<template slot-scope="scope">
							<el-button type="success" size="small" @click="toCreareView(scope.row)">生成表格</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
		</main-content>
	</div>
</template>

<script>
export default {
	data() {
		return {
			tableData: [],
			parmas: {
				url: "",
				name: "",
				baseUrl: "",
			},
		};
	},
	created() {
		// 初始化 parmas
		let parmas = JSON.parse(window.sessionStorage.getItem("APIParmas"));
		if (parmas) this.parmas = parmas;
		this.getApilist();
	},
	beforeDestroy() {
		// 销毁前 使用assign缓存数据
		window.sessionStorage.setItem("APIParmas", JSON.stringify(this.parmas));
	},

	methods: {
		// 搜索
		search() {
			this.getApilist();
		},
		// 跳转 生成页面
		toCreareView(row) {
			this.$router.push({
				path: "/createCode/CreateCodeView?url="+row.urlName
				
			});
		},
		// 请求 接口列表
		getApilist() {
			this.$axios.get("/v2/api-docs").then((res) => {
				// console.log(res.data.paths);
				let paths = [];
				let tempObj = JSON.parse(JSON.stringify(res.data.paths));
				for (const key in tempObj) {
					tempObj[key].urlName = key.replaceAll(this.$envConfig.api, "");
					let data = tempObj[key].post ? tempObj[key].post : tempObj[key].get;
					tempObj[key].data = data
					tempObj[key].tags = data.tags[0];
					tempObj[key].summary = data.summary;
					paths.push(tempObj[key]);
				}
				let tags = res.data.tags;
        window.sessionStorage.setItem("APIpathsList", JSON.stringify(paths));
				tags.forEach((item1, index1) => {
					item1.children = [];
					item1.id = index1;
					item1.type = 1;
					item1.hasChildren = false;
					paths.forEach((item2, index2) => {
						item2.name = item2.summary;
						item2.id = index1 + index2 + item2.urlName;
						if (item1.name == item2.tags) {
							item1.children.push(item2);
						}
					});
				});
				// 过滤 tags 搜索条件
				let temp = [];
				if (this.parmas.url) {
					tags.forEach((item1, index1) => {
						item1.children.forEach((item2, index2) => {
							if (item2.urlName.indexOf(this.parmas.url) > -1) {
								temp.push(item2);
							}
						});
					});
					tags = temp;
				}
				// 过滤 tags 搜索条件
				if (this.parmas.name && tags.length != 1) {
					temp = [];
					tags.forEach((item1, index1) => {
						if (!item1.children) {
							if (item1.name.indexOf(this.parmas.name) > -1) {
								temp.push(item1);
							}
						} else {
							item1.children.forEach((item2, index2) => {
								if (item2.name.indexOf(this.parmas.name) > -1) {
									temp.push(item2);
								}
							});
						}
					});
					tags = temp;
				}
				console.log(tags);
				this.tableData = tags;
			});
		},
	},
};
</script>
