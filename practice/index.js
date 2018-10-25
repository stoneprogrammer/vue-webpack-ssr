import Vue from 'vue'

const div = document.createElement('div')
document.body.appendChild(div)

new Vue({
  template: `<div>Helloe World</div>`
}).$mount(div)
