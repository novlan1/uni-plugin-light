import { updateAssetSource, getWebInsertCode, type IGenVersionOptions } from '@plugin-light/shared';


export class GenVersionWebPlugin {
  options: IGenVersionOptions;

  constructor(options: IGenVersionOptions = {}) {
    this.options = options || {};
  }


  apply(compiler: any) {
    compiler.hooks.emit.tap('genVersionPlugin', (compilation: any) => {
      try {
        const { assets } = compilation;
        const key = 'index.html';
        if (!assets[key]) return;

        const source = assets[key].source().toString();
        const insertCode = getWebInsertCode(this.options);

        const idx = source.lastIndexOf('</body>');
        const newSource = source.slice(0, idx) + insertCode + source.slice(idx);

        updateAssetSource(assets, key, newSource);
      } catch (err) {
        console.warn('[GenVersionMpPlugin] err: ', err);
      }
    });
  }
}
