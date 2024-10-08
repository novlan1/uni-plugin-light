import { transFormRem } from 't-comm/lib/rem/rem';
import { PLATFORM_MAP, CSS_POSTFIX_MAP } from '@plugin-light/shared';

function isInWhiteList(whiteList: Array<string>, fileName: string) {
  for (const item of whiteList) {
    if (fileName.indexOf(item) > -1) {
      console.log(`[REM] ${fileName} 已被跳过处理`);
      return true;
    }
  }
  return false;
}


export class RemToRpxPlugin {
  whiteList: Array<string>;
  factor: number;
  unit: string;
  fileSuffix: Array<string>;

  constructor(options: {
    whiteList?: Array<string>
    factor?: number
    unit?: string
    fileSuffix?: Array<string>
  } = {}) {
    const { whiteList, factor, unit, fileSuffix } = options || {};
    this.whiteList = whiteList || [];
    this.factor = factor || 100;
    this.unit = unit || 'rpx';
    this.fileSuffix = fileSuffix || [
      'css',
      'scss',
      'less',

      CSS_POSTFIX_MAP.MP_WX,
      CSS_POSTFIX_MAP.MP_QQ,
      CSS_POSTFIX_MAP.MP_ALIPAY,
      CSS_POSTFIX_MAP.MP_JD,
    ];
  }

  apply(complier: any) {
    if (process.env.UNI_PLATFORM === PLATFORM_MAP.H5) return;
    const reg = new RegExp(`.(${this.fileSuffix.join('|')})$`);

    complier.hooks.emit.tapAsync('RemToRpxPlugin', (compilation: any, cb: Function) => {
      const fileNames = Object.keys(compilation.assets);
      for (const fileName of fileNames) {
        if (!reg.test(fileName)) {
          continue;
        }
        if (isInWhiteList(this.whiteList, fileName)) {
          continue;
        }

        const asset = compilation.assets[fileName];
        if (asset._valueIsBuffer) {
          continue;
        }

        const sourceCode = asset.source() || asset._valueAsString || asset._value || asset._cachedSource;
        if (sourceCode != null) {
          // 这里返回null或者undefined会导致编译过程无法结束，所以sourceCode需要判空才给asset.source赋值
          const newSource = transFormRem(sourceCode, this.factor, this.unit);

          compilation.assets[fileName] = {
            source() {
              return newSource;
            },
            size() {
              return newSource.length;
            },
          };
        }
      }
      cb?.();
    });
  }
}

