import AlarmClock from "@iconify-icons/ep/alarm-clock";
import Male from "@iconify-icons/ep/male";
import Tickets from "@iconify-icons/ep/tickets";
import Warning from "@iconify-icons/ep/warning";
import Iphone from "@iconify-icons/ep/iphone";
import Notebook from "@iconify-icons/ep/notebook";
import User from "@iconify-icons/ri/user-3-fill";
import { reactive, ref } from "vue";
import { message } from "@/utils/message";
import { getUserInfo } from "@/api/system/user";

export function useProfile() {
  const loading = ref(false);
  const userInfo = ref([]);
  const sexMap = new Map([
    [1, "男"],
    [2, "女"]
  ]);
  const statusMap = new Map([
    [1, "启用"],
    [2, "禁用"]
  ]);

  async function onLoadUserInfo() {
    loading.value = true;
    await getUserInfo()
      .then(res => {
        if (res.success) {
          userInfo.value.push(res.data.list);
        } else {
          message(res.message, {
            type: "error"
          });
        }
      })
      .catch(res => {
        message(res.response.data.message, {
          type: "error"
        });
      })
      .finally(() => {
        loading.value = false;
      });
  }

  const columnsA = [
    {
      prop: "username",
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={User} />
          </el-icon>
          用户名
        </div>
      )
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
      )
    },
    {
      prop: "sex",
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Male} />
          </el-icon>
          性别
        </div>
      ),
      cellRenderer: ({ value }) => {
        return <el-tag size="small">{sexMap.get(value)}</el-tag>;
      }
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
      width: 80
    },
    {
      prop: "status",
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Warning} />
          </el-icon>
          状态
        </div>
      ),
      cellRenderer: ({ value }) => {
        return <el-tag size="small">{statusMap.get(value)}</el-tag>;
      },
      width: 80
    },
    {
      prop: "CreatedAt",
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={AlarmClock} />
          </el-icon>
          创建时间
        </div>
      ),
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
      )
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
    loading,
    userInfo,
    onLoadUserInfo,
    editPasswdForm,
    passwdFormRules
  };
}
