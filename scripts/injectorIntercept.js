const { name, version } = require('../package.json');

// const __myGlobal = {
//     name,
//     version,
//     NAME_UP: name.toUpperCase()
// };

// const __globalScript = `<script>var __global = ${JSON.stringify(__myGlobal)}; console.info('__global', __global); </script>`;

// const getScript = (url) => {
//     return `<script src="${url}"></script>`;
// }

// hexo.extend.injector.register('head_begin', __globalScript, 'default');
// hexo.extend.injector.register('head_begin', getScript(`/${name}/js/authorization.js`), 'default');
hexo.extend.injector.register('head_begin', `<link rel="stylesheet" href="/${name}/css/custom.css" />`, 'default');

/* hexo.extend.filter.register('theme_inject', function(injects) {
    injects.footer.raw('default', `<div class="footer-inner"><div class="footer-content"><a href="https://hexo.io" target="_blank" rel="nofollow noopener"><span>Hexo</span> <i class="iconfont icon-love"></i> ${version}</a></div></div>`);
}); */