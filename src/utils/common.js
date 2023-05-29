import axios from '@/config/http'
import envConfig from '../config/envConfig';
export default {
	isPhone(phone) {
		var reg = /^1[3-9]\d{9}$/;
		if (reg.test(phone)) {
			return true;
		} else {
			return false;
		}
	},

	/**
	 * 身份证号, 支持1/2代(15位/18位数字)
	 * @param { string } value
	 */
	isIDCard(value) {
		if (/(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/g
			.test(value)) {
			return value;
		} else {
			return '';
		}
	},


	isMoney(value) {
		if (!/^\d+(\.\d{1,2})?$/.test(value)) {
			return false
		}
		return true
	},

	// 判断数据原型类型
	prototype(obj, type) {
		if (Object.prototype.toString.call(obj) == '[object ' + type + ']') {
			return true;
		} else {
			return false;
		}
	},

	//--------日期转换-----------
	//xxxx-xx-xx xx:xx:xx
	getDate(str) {
		if (str == "" || str == null) {
			return "";
		}
		if (typeof (str) == 'string') {
			str = str.replace(/-/g, '/');
		}
		var oDate = new Date(str),
			oYear = oDate.getFullYear(),
			oMonth = oDate.getMonth() + 1,
			oDay = oDate.getDate(),
			oHour = oDate.getHours(),
			oMin = oDate.getMinutes(),
			oSen = oDate.getSeconds(),
			oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin) +
				':' + this.getzf(oSen); //最后拼接时间
		return oTime;
	},

	//xxxx-xx-xx
	getDay(str) {
		if (str == "" || str == null) {
			return "";
		}
		if (typeof (str) == 'string') {
			str = str.replace(/-/g, '/');
		}
		var oDate = new Date(str),
			oYear = oDate.getFullYear(),
			oMonth = oDate.getMonth() + 1,
			oDay = oDate.getDate(),
			oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay); //最后拼接时间
		return oTime;
	},

	//补0操作
	getzf(num) {
		if (parseInt(num) < 10) {
			num = '0' + num;
		}
		return num;
	},

	// 判断数据原型类型
	isPrototype(obj, type) {
		if (Object.prototype.toString.call(obj) == '[object ' + type + ']') {
			return true;
		} else {
			return false;
		}
	},

	/**
	 * 数字千分号格式化
	 * @param {Object} num 数值
	 * @param {Object} isMoney 是否格式化为(元)单位
	 */
	toThousands(num, isMoney) {
		num = (num ? (isMoney ? Number(num).toFixed(2) : num) : 0).toString();
		let re = /(\d{3})$/,
			result = '';
		const s = num.split('.');
		num = s[0];
		while (re.test(num)) {
			result = RegExp.lastMatch + result;
			if (num !== RegExp.lastMatch) {
				result = ',' + result;
				num = RegExp.leftContext;
			} else {
				num = '';
				break;
			}
		}
		if (num) {
			result = num + result;
		}

		return s[1] ? result + '.' + s[1] : result;
	},

	// 生成树结构数据
	translator(parents, childrens, callback) {
		let itemParents = parents
		let itemChildrens = childrens
		let translatorFun = (parents, childrens) => {
			parents.forEach((parent) => {
				childrens.forEach((current, index) => {
					if (current.parentId === parent.id) {
						let temp = JSON.parse(JSON.stringify(childrens))
						temp.splice(index, 1)
						translatorFun([current], temp)
						let child = callback(current);
						child.children = current.children;
						typeof parent.children !== 'undefined' ? parent.children.push(child) : parent.children = [child]
					}
				})
			})
		}
		translatorFun(itemParents, itemChildrens);
		return itemParents;
	},

	loadView(view) {  // 路由组件加载
		return resolve => {
			require.ensure([], (require) => {
				resolve(require('@/views/' + view + '.vue'))
			})
		}
	},

	// 请求所有接口
	getApiList() {
		return new Promise((resolve, reject) => {
			axios.get("/v2/api-docs").then((res) => {
				let paths = [];
				let tempObj = JSON.parse(JSON.stringify(res.data.paths));
				for (const key in tempObj) {
					tempObj[key].urlName = key.replaceAll(envConfig.api, "");
					let data = tempObj[key].post ? tempObj[key].post : tempObj[key].get;
					tempObj[key].data = data;
					paths.push(tempObj[key]);
				}
				let tags = res.data.tags.map((item) => {
					return {
						children: [],
						label: item.name,
						value: item.name,
					};
				});
				paths.forEach((item1) => {
					let index = tags.findIndex((item2) => item2.label == item1.data.tags[0]);
					tags[index].children.push({
						label: item1.data.summary,
						value: item1.urlName,
					});
				});
				resolve([tags,paths])
			});
		})
	},
	
}
