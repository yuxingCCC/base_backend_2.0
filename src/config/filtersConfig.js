// 数字千分号格式化
let permil = value => {
	let n = 2;
	value = parseFloat((value + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	let l = value.split(".")[0].split("").reverse(),
		r = value.split(".")[1];
	let t = "";
	for (let i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
	}
	return t.split("").reverse().join("") + "." + r;
};

// 金额格式
let money = value =>{
	return value.toFixed(2);
};


export {
	money,
	permil
};
