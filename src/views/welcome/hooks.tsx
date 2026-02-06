// import type { EChartsOption } from "echarts";
// import { reactive } from "vue";

// export function useEcharts() {
//   var option: EChartsOption = reactive({
//     tooltip: {
//       trigger: "axis",
//       axisPointer: {
//         type: "shadow"
//       }
//     },
//     legend: {
//       data: ["Forest", "Steppe", "Desert", "Wetland"]
//     },
//     xAxis: [
//       {
//         type: "category",
//         axisTick: { show: false },
//         data: ["2012", "2013", "2014", "2015", "2016"]
//       }
//     ],
//     yAxis: [
//       {
//         type: "value"
//       }
//     ],
//     series: [
//       {
//         name: "Forest",
//         type: "bar",
//         emphasis: {
//           focus: "series"
//         },
//         data: [320, 332, 301, 334, 390]
//       },
//       {
//         name: "Steppe",
//         type: "bar",
//         emphasis: {
//           focus: "series"
//         },
//         data: [220, 182, 191, 234, 290]
//       },
//       {
//         name: "Desert",
//         type: "bar",
//         emphasis: {
//           focus: "series"
//         },
//         data: [150, 232, 201, 154, 190]
//       },
//       {
//         name: "Wetland",
//         type: "bar",
//         emphasis: {
//           focus: "series"
//         },
//         data: [98, 77, 101, 99, 40]
//       }
//     ]
//   });

//   var option1: EChartsOption = reactive({
//     tooltip: {
//       trigger: "axis",
//       axisPointer: {
//         type: "shadow"
//       }
//     },
//     legend: {
//       data: ["Forest", "Steppe"]
//     },
//     xAxis: [
//       {
//         type: "category",
//         axisTick: { show: false },
//         data: ["2012", "2013"]
//       }
//     ],
//     yAxis: [
//       {
//         type: "value"
//       }
//     ],
//     series: [
//       {
//         name: "Forest",
//         type: "bar",
//         emphasis: {
//           focus: "series"
//         },
//         data: [320, 332, 301, 334, 390]
//       },
//       {
//         name: "Steppe",
//         type: "bar",
//         emphasis: {
//           focus: "series"
//         },
//         data: [220, 182, 191, 234, 290]
//       },
//       {
//         name: "Desert",
//         type: "bar",
//         emphasis: {
//           focus: "series"
//         },
//         data: [150, 232, 201, 154, 190]
//       },
//       {
//         name: "Wetland",
//         type: "bar",
//         emphasis: {
//           focus: "series"
//         },
//         data: [98, 77, 101, 99, 40]
//       }
//     ]
//   });

//   return { option, option1 };
// }
