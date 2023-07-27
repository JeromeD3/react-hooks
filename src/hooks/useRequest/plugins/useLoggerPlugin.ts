/**
 * 所谓插件，就是在class的生命周期钩子中执行的函数
 */
const useLoggerPlugin = (request: any) => {
  return {
    onBefore: (config: any) => {
      console.log('自定义插件：onBefore', config)
    },
  }
}
useLoggerPlugin.onInit = (option: any) => {
  console.log('自定义插件：onInit', option)
}
export default useLoggerPlugin
