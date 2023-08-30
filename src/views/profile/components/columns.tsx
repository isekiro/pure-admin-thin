import OfficeBuilding from "@iconify-icons/ep/office-building";
import Tickets from "@iconify-icons/ep/tickets";
import Location from "@iconify-icons/ep/location";
import Iphone from "@iconify-icons/ep/iphone";
import Notebook from "@iconify-icons/ep/notebook";
import User from "@iconify-icons/ri/user-3-fill";
import { reactive, ref } from "vue";

export function useColumns() {
  const lists = [{ type: "", label: "启用" }];

  const columnsA = [
    {
      prop: "name",
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={User} />
          </el-icon>
          用户名
        </div>
      ),
      value: "乐于分享的程序员小铭"
    },
    {
      prop: "mobile",
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Iphone} />
          </el-icon>
          手机号
        </div>
      ),
      value: "123456789"
    },
    {
      prop: "sex",
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Location} />
          </el-icon>
          性别
        </div>
      ),
      value: "男"
    }
  ];

  const columnsB = [
    {
      prop: "nickname",
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Tickets} />
          </el-icon>
          昵称
        </div>
      ),
      value: "管理员",
      width: 80
    },
    {
      prop: "status",
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Tickets} />
          </el-icon>
          状态
        </div>
      ),
      cellRenderer: () => {
        return lists.map(v => {
          return (
            <el-tag class="mr-[10px]" type={v.type} size="small" effect="dark">
              {v.label}
            </el-tag>
          );
        });
      },
      width: 80
    },
    {
      prop: "CreatedAt",
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={OfficeBuilding} />
          </el-icon>
          创建时间
        </div>
      ),
      value: "2023-03-23 18:19:37",
      width: 80
    }
  ];

  const columnsC = [
    {
      prop: "remark",
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Notebook} />
          </el-icon>
          备注
        </div>
      ),
      cellRenderer: () => <span>办法总比困难多</span>
    }
  ];

  interface PasswdFormType {
    password: string;
  }

  const editPasswdForm = reactive<PasswdFormType>({
    password: ""
  });
  const passwdFormRules = ref();

  return {
    columnsA,
    columnsB,
    columnsC,
    editPasswdForm,
    passwdFormRules
  };
}
