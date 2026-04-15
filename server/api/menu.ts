// server/api/index.ts
// 提供GET接口，返回菜单配置
export default defineEventHandler(async (event) => {
    // 只允许GET请求
    if (event.method !== 'GET') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }
  
    // 你要的菜单数据 👇 直接完整写死在这里
    const menuList = [
      { 
        name: '首页', route: '/', icon: 'Home', index: 0,
        subMenu: [
          { name: '综合看板', route: '/dashboard/overview', icon: 'TvMinimal', index: 0 },
          { name: '能量看板', route: '/dashboard/energy', icon: 'Atom', index: 1 }
        ]
      },
      { 
        name: '能源管理', route: '/energy/pvoverview', icon: 'Zap', index: 1,
        subMenu: [
          { 
            name: '光伏监测', route: '/energy/pv', icon: 'Sun', index: 0,
            subMenu: [
              { name: '光伏总览', route: '/energy/pvoverview', index: 0 },
              { name: '逆变器监视', route: '/energy/pvinverter', index: 1 },
              { name: '告警总览', route: '/energy/pvalarm', index: 2 }
            ]
          },
          { 
            name: '风电监测', route: '/energy/wind', icon: 'Wind', index: 1,
            subMenu: [
              { name: '风电总览', route: '/energy/windoverview', index: 0 },
              { name: '风机监视', route: '/energy/windturbine', index: 1 },
            ]
          }
        ]
      },
      { name: '储能管理', route: '/storage', icon: 'Battery', index: 2,
        subMenu: [
          { name: '储能总览', route: '/storage/stoverview', icon: 'GalleryThumbnails', index: 0 },
          { name: '储能单元', route: '/storage/stunit', icon: 'Boxes', index: 1 },
          { name: 'BMS监视', route: '/storage/stmonitor', icon: 'ChartNoAxesCombined', index: 2 },
        ]
      },
      { name: '负荷管理', route: '/load', icon: 'Activity', index: 3, 
        subMenu: [
          { name: '负荷监测', route: '/load/monitor', icon: 'GalleryThumbnails', index: 0 },
          { name: '负荷建模', route: '/load/model', icon: 'Boxes', index: 1 },
          { name: '负荷分析', route: '/load/analyse', icon: 'ChartNoAxesCombined', index: 2 },
        ] 
      },
      { name: '预测管理', route: '/forecast', icon: 'TrendingUp', index: 4, subMenu: [] },
      { name: '策略管理', route: '/strategy', icon: 'Sliders', index: 5, subMenu: [] },
      { name: '能碳管理', route: '/carbon', icon: 'Cloud', index: 6, subMenu: [] },
      { name: '电力交易', route: '/trade', icon: 'BarChart3', index: 7, subMenu: [] },
      { name: '基础设置', route: '/base', icon: 'Settings', index: 8, subMenu: [] },
      { name: '系统设置', route: '/system', icon: 'Shield', index: 9, subMenu: [] },
    ]
  
    // 返回标准接口格式（兼容你之前封装的请求）
    return {
      code: 200,
      data: menuList,
      message: '获取菜单成功'
    }
  })