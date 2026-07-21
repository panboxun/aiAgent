import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { 
    path: '/', 
    redirect: '/login'
  },
  { 
    path: '/login', 
    name:"Login",
    component: () => import('@/components/login/index.vue'), 
  },
  {
    path:"/index",
    name:"Main",
   
    component: () => import('@/components/main/index.vue'), 
    children:[
      {
        path:"dashboard",
        component: () => import('@/view/main.vue'), 
        meta:{
          title:"数据分析",
          icon:"Notification",
          meta:{
            roles:["admin"]
          }
        }
      },
      {
        path:"knowledge",
        component: () => import('@/view/knowledge.vue'), 
        keepAlive: true,
        meta:{
          title:"知识文章",
          icon:"Star"
        }
      },
      {
        path:"consultations",
        component: () => import('@/view/consultations.vue'), 
        meta:{
          title:"咨询记录",
          icon:"Connection"
        }
      },
      {
        path:"emotional",
        component: () => import('@/view/emotional/emotional.vue'), 
        meta:{
          title:"情绪日志",
          icon:"User"
        }
      },
      {
        path:"horse",
        component: () => import('@/view/horse.vue'), 
        meta:{
          title:"走马灯",
          icon:"User"
        }
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})



export default router