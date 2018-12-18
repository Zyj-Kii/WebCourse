export default {
  install (Vue) {
    Vue.prototype.$formatDate = times => {
      let date = new Date(times)
      let format = ''
      format += date.getFullYear() + '-'
      if ((date.getMonth() + 1) <= 9) {
        format += '0' + (date.getMonth() + 1)
      } else {
        format += (date.getMonth() + 1)
      }
      format += '-'
      if (date.getDate() <= 9) {
        format += '0' + date.getDate()
      } else {
        format += date.getDate()
      }
      return format
    }
  }
}
