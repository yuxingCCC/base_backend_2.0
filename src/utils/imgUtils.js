export default {

	// 图片文件转 base64 格式
	toBase64(file, callback) {
		if (!file) return;
		let reader = new FileReader(); //html5读文件
		reader.readAsDataURL(file);
		reader.onload = (data) => {
			callback(data.currentTarget.result, data);
		}
	},

	// 远程图片url转base64
	linkToDataURL(url, domain, callback) {
		let image = new Image();
		image.crossOrigin = domain; // 设置跨域
		image.onload = () => {
			var base64 = this.getBase64Image(image);
			callback(base64);
		}
		image.src = url;
	},

	// 通过Image对象获取base64
	getBase64Image(img) {
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, img.width, img.height);
		var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
		var dataURL = canvas.toDataURL("image/jpeg");
		return dataURL;
	},

	// base64 转 blob 对象
	convertBase64UrlToBlob(urlData) {
		//去掉url的头，并转换为byte 
		var bytes = window.atob(urlData.split(',')[1]);
		//处理异常,将ascii码小于0的转换为大于0  
		var ab = new ArrayBuffer(bytes.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < bytes.length; i++) {
			ia[i] = bytes.charCodeAt(i);
		}
		return new Blob([ab], {
			type: 'image/png'
		});
	},

	// base64 转文件对象
	dataURLtoFile(dataurl, filename) {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, {
			type: mime
		});
	},

	// 图片压缩
	canvasDataURL(path, obj, callback) {
		var img = new Image();
		img.src = path;
		let limit = 1;
		var resultInfo = {};
		img.onload = function() {
			var that = this;
			// 默认按比例压缩
			var w = that.width,
				h = that.height,
				scale = w / h;
			resultInfo = that;
			resultInfo.scale = scale;
			w = obj.width || w;
			h = obj.height || (w / scale);
			var quality = 0.7; // 默认图片质量为0.7
			limit = obj.limit ? obj.limit : 1 // 默认为超过1M 进行压缩
			//生成canvas
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			// 创建属性节点
			var anw = document.createAttribute("width");
			anw.nodeValue = w;
			var anh = document.createAttribute("height");
			anh.nodeValue = h;
			canvas.setAttributeNode(anw);
			canvas.setAttributeNode(anh);
			ctx.drawImage(that, 0, 0, w, h);
			// 图像质量

			if (obj.quality && obj.quality <= 1 && obj.quality > 0) quality = obj.quality;
			// quality值越小，所绘制出的图像越模糊
			var base64 = obj.fileSize > (limit * 1024) ? canvas.toDataURL('image/jpeg', quality) : canvas.toDataURL(
				'image/jpeg');
			// 回调函数返回base64的值
			callback(base64, resultInfo);
		}
	},

	// 图片保存到本地
	downloadImg(url) {
		if (this.myBrowser() === "IE" || this.myBrowser() === "Edge") {
			this.saveAs5(url);
		} else {
			this.download(url);
		}
	},
	
	
	//判断浏览器类型
	myBrowser() {
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		var isOpera = userAgent.indexOf("Opera") > -1;
		if (isOpera) {
			return "Opera"
		}; //判断是否Opera浏览器
		if (userAgent.indexOf("Firefox") > -1) {
			return "FF";
		} //判断是否Firefox浏览器
		if (userAgent.indexOf("Chrome") > -1) {
			return "Chrome";
		}
		if (userAgent.indexOf("Safari") > -1) {
			return "Safari";
		} //判断是否Safari浏览器
		if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
			return "IE";
		}; //判断是否IE浏览器
		if (userAgent.indexOf("Trident") > -1) {
			return "Edge";
		} //判断是否Edge浏览器
	},
	
	//IE浏览器图片保存本地
	saveAs5(imgURL) {
		var oPop = window.open(imgURL, "", "width=1, height=1, top=5000, left=5000");
		for (; oPop.document.readyState != "complete";) {
			if (oPop.document.readyState == "complete") break;
		}
		oPop.document.execCommand("SaveAs");
		oPop.close();
	},
	
	//谷歌，360极速等浏览器下载
	download(src) {
		var a = document.createElement('a');
		a.setAttribute("href", src);
		a.setAttribute("download", "");
		var evObj = document.createEvent('MouseEvents');
		evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
		a.dispatchEvent(evObj);
	}
	
}
