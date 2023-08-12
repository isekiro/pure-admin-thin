import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/role",
    method: "post",
    response: () => {
      return {
        success: true,
        data: {
          list: [
            {
              createTime: 1609837428000,
              updateTime: 1645477701000,
              creator: "admin",
              updater: "",
              deleted: false,
              tenantId: 1,
              id: 1,
              name: "超级管理员",
              code: "admin",
              sort: 1,
              status: 1,
              type: 1,
              remark: "超级管理员",
              dataScope: 1,
              dataScopeDeptIds: null
            },
            {
              createTime: 1609837428000,
              updateTime: 1645477700000,
              creator: "admin",
              updater: "",
              deleted: false,
              tenantId: 1,
              id: 2,
              name: "普通角色",
              code: "common",
              sort: 2,
              status: 1,
              type: 1,
              remark: "普通角色",
              dataScope: 2,
              dataScopeDeptIds: null
            },
            {
              createTime: 1609912175000,
              updateTime: 1647698441000,
              creator: "",
              updater: "1",
              deleted: false,
              tenantId: 1,
              id: 101,
              name: "测试账号",
              code: "test",
              sort: 0,
              status: 1,
              type: 2,
              remark: "132",
              dataScope: 1,
              dataScopeDeptIds: []
            }
          ],
          total: 3
        }
      };
    }
  },
  {
    url: "/user",
    method: "post",
    response: () => {
      return {
        success: true,
        data: {
          list: [
            {
              username: "admin",
              nickname: "admin",
              remark: "管理员",
              deptId: 103,
              postIds: [1],
              mobile: "15888888888",
              sex: 0,
              id: 1,
              status: 1,
              createTime: 1609837427000,
              dept: {
                id: 103,
                name: "研发部门"
              }
            },
            {
              username: "pure",
              nickname: "pure",
              remark: "不要吓我",
              deptId: 104,
              postIds: [1],
              mobile: "15888888888",
              sex: 0,
              id: 100,
              status: 1,
              createTime: 1609981637000,
              dept: {
                id: 104,
                name: "市场部门"
              }
            },
            {
              username: "小姐姐",
              nickname: "girl",
              remark: null,
              deptId: 106,
              postIds: null,
              mobile: "15888888888",
              sex: 1,
              id: 103,
              status: 1,
              createTime: 1610553035000,
              dept: {
                id: 106,
                name: "财务部门"
              }
            },
            {
              username: "小哥哥",
              nickname: "boy",
              remark: null,
              deptId: 107,
              postIds: [],
              mobile: "15888888888",
              sex: 0,
              id: 104,
              status: 0,
              createTime: 1611166433000,
              dept: {
                id: 107,
                name: "运维部门"
              }
            }
          ],
          total: 4
        }
      };
    }
  }
] as MockMethod[];
