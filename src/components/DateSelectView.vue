<template>
    <div id="census">
        <!-- 日期选择 -->
        <div class="graphic">
            <span class="font_size14 font_text">按时间周期&nbsp;&nbsp;</span>
            <el-select size="mini" v-model="date3" placeholder="请选择" @change="getDate"
                       :disabled="dateRange && dateRange.length > 0" style="width: 120px; margin-right: 10px">
                <el-option v-for="item in options" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-date-picker
                style="margin-right: 20px; width: 200px;"
                :disabled="dateRange && dateRange.length > 0"
                v-model="deftime"
                :type="date3"
                :picker-options="pickerOptions"
                :format="textList[date3]"
                placeholder="选择周"
                size="mini"
                @change="getDate"
                :clearable="false">
            </el-date-picker>
            <span class="font_size14 font_text">指定日期&nbsp;&nbsp;</span>
            <el-date-picker
                style="position: relative; top: 1px; width: 350px;"
                size="mini"
                v-model="dateRange"
                @change="dateRangeChange"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="RangePickerOptions"
            >
            </el-date-picker>
            <slot name="extend"></slot>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            value1: "",
            options: [{
                label: "周视图",
                value: "week"
            },
                {
                    label: "月视图",
                    value: "month"
                },
                {
                    label: "年视图",
                    value: "year"
                }
            ],
            textList: {
                week: "yyyy 年第 WW 周(MM月)",
                month: "yyyy 年 - MM月",
                year: "yyyy 年"
            },
            date3: "week",
            deftime: new Date(),
            year: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            month: [
                // 每个月的天数均不相同, 所以这里为动态
            ],
            week: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
            list: [],
            load: false,
            pickerOptions: {
                firstDayOfWeek: 1,
                shortcuts: [{
                    text: '本周',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '上周',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }],
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6
                }
            },

            dateRange: [],

            RangePickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近两个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 60);
                        picker.$emit('pick', [start, end]);
                    }
                }],
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6
                }
            },

            nears: {
                orderNum1: null,
                orderNum7: null,
                orderNum30: null,
                all: null,
            }
        };
    },

    created() {
        // this.getData();
        // this.getOrderNum();
    },

    watch: {
        date3(val) {
            this.pickerOptions.shortcuts.splice(0)
            switch (val) {
                case 'week':
                    this.pickerOptions.shortcuts.push({
                        text: '本周',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '上周',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    })
                    break;
                case 'month':
                    this.pickerOptions.shortcuts.push({
                        text: '本月',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '上月',
                        onClick(picker) {
                            var month = new Date().getMonth();
                            var year = new Date().getFullYear()
                            var date = ((month == 0) ? ((year - 1) + "-12-01 00:00") : (year + "-" + month + '-01 00:00'));
                            picker.$emit('pick', new Date(date));
                        }
                    })
                    break;
                case 'year':
                    this.pickerOptions.shortcuts.push({
                        text: '本年',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '上年',
                        onClick(picker) {
                            picker.$emit('pick', new Date((new Date().getFullYear() - 1) + '-01-01 00:00'));
                        }
                    })
                    break;
                default:
                    break;
            }
        }
    },

    mounted() {
        this.getDate()
    },

    methods: {
        getDate() {
            var startTime, endTime;
            var dateStrs = [];
            switch (this.date3) {
                case 'week':
                    var selectDate = this.$moment(this.deftime).format('YYYY-MM-DD')
                    // 获取本日在当前周的第几日
                    var thisWeekDay = this.$moment().format('E')
                    // 获取本周的第一天
                    var weekOneDay = this.$moment().subtract(thisWeekDay - 1, 'days').format('Y-MM-DD');
                    // 检查选择的日期是否在两个时间内
                    if (this.$moment(selectDate).isBetween(weekOneDay, new Date())) {
                        // 返回周一到当前今天的时间
                        var weeks = []
                        for (var i = 0; i < thisWeekDay; i++) {
                            weeks.push('星期' + this.getChnNumChar(i))
                        }
                        dateStrs = weeks
                        startTime = weekOneDay
                    } else {
                        startTime = this.$moment(this.deftime).subtract(1, 'days').format('YYYY-MM-DD')
                        dateStrs = this.week
                    }
                    endTime = this.$moment(startTime).add(dateStrs.length - 1, 'days').format('Y-MM-DD')
                    break;
                case 'month':
                    var selectDate = this.$moment(this.deftime).format('YYYY-MM-DD')
                    var thisMonth = new Date().getMonth()
                    var thisYear = new Date().getFullYear()
                    if (thisMonth == this.deftime.getMonth() && thisYear == this.deftime.getFullYear()) {
                        // 如果是本月
                        this.month.splice(0)
                        for (var i = 0; i < new Date().getDate(); i++) {
                            this.month.push(i + 1 + '号')
                        }
                    } else {
                        this.getMonth(selectDate)
                    }
                    dateStrs = this.month
                    startTime = this.$moment(this.deftime).format('Y-MM') + '-01'
                    endTime = this.$moment(startTime).add(dateStrs.length - 1, 'days').format('Y-MM-DD')
                    break;
                case 'year':
                    var thisYear = new Date().getFullYear();
                    if (thisYear == this.deftime.getFullYear()) {
                        // 如果是本年
                        dateStrs.splice(0)
                        for (var i = 0; i < new Date().getMonth() + 1; i++) {
                            dateStrs.push(i + 1 + '月')
                        }
                    } else {
                        dateStrs = this.year
                    }
                    startTime = this.$moment(this.deftime).format('Y') + '-01-01'
                    var days = this.deftime.getFullYear() == thisYear ? new Date().getDate() : '31'
                    endTime = `${this.$moment(this.deftime).format('Y')}-${dateStrs.length}-${days}`
                    break;
            }
            this.$emit('changeDate', {
                type: this.date3,
                dates: [startTime, endTime],
                dateStrs
            })
        },

        // 动态设置指定月份的天数
        getMonth(date) {
            console.log(date)
            let d = new Date(date)
            // 将日期设置为下月一号
            d.setMonth(d.getMonth() + 1)
            d.setDate('1')
            // 获取本月最后一天
            d.setDate(d.getDate() - 1)
            this.month.splice(0)
            for (var i = 1; i <= d.getDate(); i++) {
                this.month.push(i + "号")
            }
        },

        getChnNumChar(num) {
            return ['一', '二', '三', '四', '五', '六', '日'][num]
        },

        dateRangeChange(val) {
            if (val) {
                var startTime = val[0]
                var endTime = val[1]
                var dateStrs = this.getDateList(startTime, endTime)
                this.$emit('changeDate', {
                    type: 'day',
                    dates: [this.$moment(val[0]).format('Y-MM-DD'), this.$moment(val[1]).format('Y-MM-DD')],
                    dateStrs
                })
            } else {
                this.getDate()
            }
        },

        // 获取两个日期间的集合
        getDateList(startDate, endDate) {
            var date = new Date(startDate)
            const dateList = []
            dateList.push(this.$moment(date).format('Y-MM-DD'))
            if (startDate.getDate() == endDate.getDate()) {
                return dateList
            } else {
                while (true) {
                    date.setDate(date.getDate() + 1)
                    if (date.getTime() < endDate.getTime()) {
                        dateList.push(this.$moment(date).format('Y-MM-DD'))
                    } else {
                        break
                    }
                }
                dateList.push(this.$moment(date).format('Y-MM-DD'))
            }
            return dateList
        }

    }

}
</script>

<style>

</style>

<style scoped>
@media screen and (max-width: 768px) {
    .graphic span {
        display: inline-block;
    }
    .graphic * {
        margin-bottom: 10px;
    }
    .graphic .el-select {
        width: auto !important;
        margin-right: 0 !important;
    }
}
</style>
