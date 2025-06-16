import zhCN from '@/locales/zh-CN.json';
import en from '@/locales/en.json';

export class I18n {
  private translations = {
    'zh-CN': zhCN,
    'en': en
  };

  private currentLanguage: string = 'zh-CN';

  // 初始化
  public init(): void {
    // 尝试从本地存储获取用户偏好的语言
    const savedLanguage = localStorage.getItem('minesweeper-language');
    if (savedLanguage && this.translations[savedLanguage as 'zh-CN' | 'en']) {
      this.currentLanguage = savedLanguage;
      // 页面标题更改
      document.title = this.translations[this.currentLanguage as 'zh-CN' | 'en'].gameTitle;
    }
    
    // 应用当前语言
    this.translatePage();
    
    // 监听语言选择器变化
    const languageSelect = document.getElementById('languageSelect') as HTMLSelectElement;
    if (languageSelect) {
      languageSelect.value = this.currentLanguage;
      languageSelect.addEventListener('change', (e) => {
        const lang = (e.target as HTMLSelectElement).value;
        this.changeLanguage(lang as 'zh-CN' | 'en');
      });
    }
  }

  // 更改语言
  public changeLanguage(lang: 'zh-CN' | 'en'): void {
    // 页面标题更改
    document.title = this.translations[lang].gameTitle;
    if (this.translations[lang]) {
      this.currentLanguage = lang;
      this.translatePage();
      
      // 保存用户偏好的语言
      localStorage.setItem('minesweeper-language', lang);
    }
  }

  // 翻译整个页面
  public translatePage(): void {
    const currentTranslations = this.translations[this.currentLanguage as 'zh-CN' | 'en'];
    
    // 翻译顶层元素
    for (const key in currentTranslations) {
      // @ts-ignore
      if (typeof currentTranslations[key] === 'string') {
        this.translateElement(key, key);
      }
    }
    
    // 翻译嵌套元素
    if (currentTranslations.gameOver) {
      for (const key in currentTranslations.gameOver) {
        const fullKey = `gameOver.${key}`;
        this.translateElement(key, fullKey);
      }
    }
  }

  // 翻译单个元素
  public translateElement(elementId: string, translationKey: string, placeholders?: { [key: string]: string }): void {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // 使用点符号解析嵌套的翻译键
    const keys = translationKey.split('.');
    let value: any = this.translations[this.currentLanguage as 'zh-CN' | 'en'];
    
    for (const key of keys) {
      if (value[key] === undefined) {
        return; // 键不存在，不做任何操作
      }
      value = value[key];
    }
    
    // 替换占位符
    if (typeof value === 'string' && placeholders) {
      for (const placeholder in placeholders) {
        const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
        value = value.replace(regex, placeholders[placeholder]);
      }
    }
    
    // 设置元素内容
    element.textContent = value;
  }
}

export default I18n