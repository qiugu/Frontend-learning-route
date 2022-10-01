window.$docsify = {
  name: '前端修行录',
  repo: 'https://github.com/qiugu/The-road-to-front-end-learning',
  logo: './images/logo.png',
  loadSidebar: true,
  loadNavbar: true,
  auto2top: true,
  subMaxLevel: 2,
  search: {
    maxAge: 86400000, // 过期时间，单位毫秒，默认一天
    placeholder: '请输入搜索的内容',
    noData: '找不到结果',
  },
  formatUpdated: '{YYYY}/{MM}/{DD} {HH}:{mm}',
  plugins: [
    function(hook, vm) {
      hook.beforeEach(function(html) {
        return (
          html +
          '\n----\n' +
          '<div style="text-align:right;font-weight:bold;">Last Updated {docsify-updated}</div>'
        );
      });
    }
  ]
}
