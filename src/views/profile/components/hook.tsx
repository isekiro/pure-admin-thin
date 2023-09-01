import AlarmClock from "@iconify-icons/ep/alarm-clock";
import Male from "@iconify-icons/ep/male";
import Tickets from "@iconify-icons/ep/tickets";
import Warning from "@iconify-icons/ep/warning";
import Iphone from "@iconify-icons/ep/iphone";
import Notebook from "@iconify-icons/ep/notebook";
import User from "@iconify-icons/ri/user-3-fill";
import { computed, reactive, ref } from "vue";
import { message } from "@/utils/message";
import { getUserInfo, updatePasswd } from "@/api/system/user";
import { FormRules, ElForm, ElMessageBox, FormInstance } from "element-plus";
import { encryptorFunc } from "@/utils/encrypt";

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
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }

  const editPasswdForm = reactive<PasswdFormType>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const editPasswdFormRef = ref<InstanceType<typeof ElForm>>();

  const REGEXP_PWD =
    /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;

  const passwdFormRules = reactive<FormRules>({
    oldPassword: [
      {
        validator: (rule, value, callback) => {
          if (value === "") {
            callback();
          }
          if (!REGEXP_PWD.test(value)) {
            callback(new Error("密码应为8-18位数字、字母、符号的任意两种组合"));
          } else {
            callback();
          }
        },
        trigger: "change"
      }
    ],
    newPassword: [
      {
        validator: (rule, value, callback) => {
          if (value === "") {
            callback();
          }
          if (!REGEXP_PWD.test(value)) {
            callback(new Error("密码应为8-18位数字、字母、符号的任意两种组合"));
          } else {
            if (editPasswdForm.confirmPassword !== "") {
              if (!editPasswdFormRef.value) return;
              editPasswdFormRef.value.validateField(
                "confirmPassword",
                () => null
              );
            } else {
              callback();
            }
          }
        },
        trigger: "change"
      }
    ],
    confirmPassword: [
      {
        validator: (rule, value, callback) => {
          if (value === "") {
            callback();
          } else {
            if (!REGEXP_PWD.test(value)) {
              callback(
                new Error("密码应为8-18位数字、字母、符号的任意两种组合")
              );
            } else {
              if (value !== editPasswdForm.newPassword) {
                callback(new Error("两次输入的密码不一致!"));
              }
            }
          }
        },
        trigger: "change"
      }
    ]
  });

  // 确认保存弹窗提醒
  const openSavingConfirm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate(async (valid, fields) => {
      if (valid) {
        ElMessageBox.confirm("是否要保存密码？", "警告", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            handlePasswordChange();
          })
          .catch(() => {
            message("取消密码保存", {
              type: "info"
            });
          });
      } else {
        console.log("error submit!", fields);
      }
    });
  };

  // 保存密码
  function handlePasswordChange() {
    // 深拷贝
    const editPasswdFormData = JSON.parse(JSON.stringify(editPasswdForm));
    if (editPasswdFormData.oldPassword.length !== 0) {
      editPasswdFormData.oldPassword = encryptorFunc(
        editPasswdFormData.oldPassword
      ) as any;
    }
    if (editPasswdFormData.newPassword.length !== 0) {
      editPasswdFormData.newPassword = encryptorFunc(
        editPasswdFormData.newPassword
      ) as any;
    }
    // 开始调用后端更新密码
    loading.value = true;
    updatePasswd(editPasswdFormData)
      .then(res => {
        if (res.success) {
          message(res.message, {
            type: "success"
          });
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

  // 密码长度小于等于8禁用按钮
  const hasPasswd = computed(
    () =>
      editPasswdForm.oldPassword.length <= 8 &&
      editPasswdForm.newPassword.length <= 8 &&
      editPasswdForm.confirmPassword.length <= 8
  );

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
  };

  return {
    columnsA,
    columnsB,
    columnsC,
    loading,
    userInfo,
    editPasswdForm,
    passwdFormRules,
    editPasswdFormRef,
    hasPasswd,
    resetForm,
    onLoadUserInfo,
    openSavingConfirm
  };
}
