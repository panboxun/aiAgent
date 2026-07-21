<template>
    <!-- 登录页 -->
    <div class="layout-container">
        <!-- 左侧侧边栏 -->
        <aside class="sidebar">
            <slot name="sidebar">
                <div class="siderbarContent">
                    <div class="siderbarTitle">
                        心理ai助手
                    </div>
                    <div class="siderbarDescribe">
                        每个深夜，每个焦虑的时刻，我们都在这里不必独自承受，让心与心的连接温暖您的每一天
                    </div>
                    <div class="siderbarIcon"></div>
                </div>
            </slot>
        </aside>
        <!-- 右侧内容区 -->
        <main class="content">
            <slot name="content">
                <div class="contentBox">
                    <div class="contentBoxTitle">
                        登录您的用户
                    </div>
                    <div class="contentBoxDescribe">
                        请输入您的账号与密码
                    </div>
                    <el-form 
                        ref="formRef" 
                        style="width: 300px" 
                        :model="dynamicValidateForm" 
                        label-width="200"

                        label-position="top"
                        class="demo-dynamic">
                        <el-form-item prop="accout" label="用户名或邮箱:" :rules="[
                            {
                                required: true,
                                message: '请输入用户名或邮箱',
                                trigger: 'blur',
                            },
                           
                        ]">
                            <el-input v-model="dynamicValidateForm.accout" />
                        </el-form-item>
                       <el-form-item prop="password" label="密码:" :rules="[
                            {
                                required: true,
                                message: '请输入密码',
                                trigger: 'blur',
                            },
                           
                        ]">
                            <el-input v-model="dynamicValidateForm.password" />
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="primary" @click="submitForm(formRef)" :loading="loading">登录账户</el-button>
                           
                        </el-form-item>
                        <el-form-item label="" label-position="right">
                             <el-form-item label="" prop="type">
                                <el-checkbox-group v-model="dynamicValidateForm.isRemember">
                                    <el-checkbox :value="true" name="type">
                                        记住密码?
                                    </el-checkbox>
                            
                                </el-checkbox-group>
                             </el-form-item>
                        </el-form-item>
                    </el-form>
                </div>
            </slot>
        </main>
    </div>
</template>


<script setup>
import { onMounted, reactive, ref, watch } from 'vue';

import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { login } from '@/api/user';
const router = useRouter();

onMounted(() => {
    if (localStorage.getItem("username")) {
        dynamicValidateForm.accout = JSON.parse(localStorage.getItem("username"));
    }
    if (localStorage.getItem("password")) {
        dynamicValidateForm.password = JSON.parse(localStorage.getItem("password"));
    }
});

const formRef = ref(null);
const loading = ref(false);

// 用户账号密码
const dynamicValidateForm = reactive({
    accout: "",
    password: "",
    isRemember: []
});


// 提交校验
const submitForm = async (formRef) => {
    if (!formRef) return;
    
    await formRef.validate(async (valid) => {
        if (valid) {
            loading.value = true;
            try {
                // 调用登录接口
                const res = await login({
                    username: dynamicValidateForm.accout,
                    password: dynamicValidateForm.password
                });
                
                // 存储 token
                if (res && res.data.token) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo));
                    localStorage.setItem('username', JSON.stringify(dynamicValidateForm.accout));
                    
                    // 记住密码
                    if (dynamicValidateForm.isRemember.length) {
                        localStorage.setItem("username", JSON.stringify(dynamicValidateForm.accout));
                        localStorage.setItem("password", JSON.stringify(dynamicValidateForm.password));
                    } else {
                        localStorage.removeItem("password");
                    }
                    
                    ElMessage.success('登录成功！');
                    
                    // 跳转到首页
                    router.push("/index/dashboard");
                    
                }
            } catch (error) {
                // ElMessage.error(error.msg || '登录失败，请重试');
            } finally {
                loading.value = false;
            }
        }
    });
};

watch(() => dynamicValidateForm.isRemember, (newVal) => {
    if (newVal.length && dynamicValidateForm.accout && dynamicValidateForm.password) {
        localStorage.setItem("username", JSON.stringify(dynamicValidateForm.accout));
        localStorage.setItem("password", JSON.stringify(dynamicValidateForm.password));
    }
});

</script>

<style scoped>
@import './index.css';
</style>
