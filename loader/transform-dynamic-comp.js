/**
 * 替换动态组件，比如：
 * components: {
 *   xxComp(resolve) {
       require(['xx.comp'], resolve);
     },
   }

    会被转为：

    import xxComp from 'xx.comp';

    components: {
      xxComp,
    }
 */
function transformDynamicComp(source = '') {
  if (process.env.VUE_APP_PLATFORM !== 'mp-weixin') {
    return source;
  }

  const reg = new RegExp(/(([a-zA-Z]+?)\(resolve\)(?:\s*?)\{(?:\n\s*)require\(\['(.*?)'\],(?:\s*?)resolve\);(?:\n\s*)\})+/, 'g');
  const match = [...source.matchAll(reg)];
  if (!match?.length) return source;
  const compList = match.map(item => ({
    name: item[2],
    file: item[3],
  }));
  const importStr = compList.reduce((acc, item) => {
    acc += `import ${item.name} from '${item.file}';\n`;
    return acc;
  }, '');


  const scriptReg = new RegExp('<script>');
  let newSource = source.replace(scriptReg, () => `<script>\n${importStr}`);

  for (const item of compList) {
    const { name, file } = item;
    const compReg = new RegExp(`${name}\\(resolve\\)\\s*\\{\\n\\s*require\\(\\['(${file})'\\],\\s*resolve\\);?\\n*\\s*\\}`);
    newSource = newSource.replace(compReg, () => `${name}`);
  }


  return newSource;
}

module.exports = transformDynamicComp;
