import MindMap from 'simple-mind-map'
import type { MindMapOptions } from './type'
import { ref } from 'vue'
import('simple-mind-map/src/plugins/Export.js' as any).then(res => {
  MindMap.usePlugin(res.default)
})
import('simple-mind-map/src/plugins/ExportPDF.js' as any).then(res => {
  MindMap.usePlugin(res.default)
})
import('simple-mind-map/src/plugins/ExportXMind.js' as any).then(res => {
  MindMap.usePlugin(res.default)
})
import { ElMessage } from 'element-plus'
//导出状态
const isExporting = ref(false) // 是否正在导出
const exportError = ref(false) // 是否导出失败

// 批量导出并自动下载的核心逻辑
export const exports = async (
  mindMapDatas: Array<MindMapOptions>,
  format: string
) => {
  isExporting.value = true
  exportError.value = false

  try {
    for (let i = 0; i < mindMapDatas.length; i++) {
      // 创建临时容器（用于渲染思维导图）
      const tempContainer = document.createElement('div')
      tempContainer.style.width = '800px'
      tempContainer.style.height = '800px'
      tempContainer.style.position = 'absolute' // 避免影响页面布局
      tempContainer.style.top = '-9999px' // 移出可视区域
      tempContainer.style.left = '-9999px'
      document.body.appendChild(tempContainer)

      // 初始化实例
      const mindMap = new MindMap({
        el: tempContainer,
        data: mindMapDatas[i]?.root,
        layout: mindMapDatas[i]?.layout
      } as any)

      // 等待渲染完成（确保节点渲染完毕，使用更稳定的渲染检测）
      await new Promise<void>(resolve => {
        const checkRender = () => {
          if (mindMap.renderer && mindMap.renderer.renderTree) {
            resolve()
          } else {
            setTimeout(checkRender, 50)
          }
        }
        checkRender()
      })

      // 导出并自动下载
      const fmt = String(format).toLowerCase().trim()
      if (fmt === 'xmind') {
        await mindMap.export(fmt, mindMapDatas[i]?.title)
      } else if (fmt === 'png' || fmt === 'pdf') {
        await mindMap.export(fmt, true, mindMapDatas[i]?.title)
      } else {
        ElMessage.error(`暂不支持${format}格式`)
      }

      // 清理临时资源
      mindMap.destroy()
      document.body.removeChild(tempContainer)

      // 避免浏览器拦截连续下载，添加间隔
      if (i < mindMapDatas.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  } catch (err) {
    console.error('导出失败：', err)
    exportError.value = true
  } finally {
    isExporting.value = false // 无论成功失败，都结束导出状态
  }
}
