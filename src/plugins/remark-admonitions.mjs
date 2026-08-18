const labels = {
  tip: '提示',
  note: '备注',
  warning: '注意',
  danger: '警告',
};

function walk(node) {
  if (!node || !Array.isArray(node.children)) return;

  for (const child of node.children) {
    if (child.type === 'containerDirective') {
      // 兼容旧主题的 :::tip 等容器语法，不要求逐篇改写 Markdown。
      const name = child.name in labels ? child.name : 'note';
      child.data = {
        ...(child.data ?? {}),
        hName: 'aside',
        hProperties: {
          className: ['admonition', `admonition-${name}`],
          'aria-label': labels[name],
        },
      };
      child.children.unshift({
        type: 'paragraph',
        data: { hName: 'strong', hProperties: { className: ['admonition-title'] } },
        children: [{ type: 'text', value: labels[name] }],
      });
    }
    walk(child);
  }
}

export function remarkAdmonitions() {
  return (tree) => walk(tree);
}

const languageAliases = {
  shell: 'bash',
  sh: 'bash',
  yml: 'yaml',
  md: 'markdown',
  txt: 'text',
  url: 'text',
};

function inferCodeLanguage(value = '') {
  const code = value.trim();
  if (/^(?:\{|\[)/.test(code)) {
    try {
      JSON.parse(code);
      return 'json';
    } catch {
      // 不是合法 JSON 时继续匹配其他语言。
    }
  }
  if (/<(?:html|head|body|div|span|script|style|\?xml)\b/i.test(code)) return 'markup';
  if (/\b(?:public|private|protected)\s+(?:class|static|void)|System\.out\.|import\s+java\./.test(code)) return 'java';
  if (/^(?:from\s+\S+\s+import|def\s+\w+|class\s+\w+|if\s+__name__|print\s*\()/m.test(code)) return 'python';
  if (/\b(?:package\s+main|func\s+\w+|fmt\.Print|import\s+\()/m.test(code)) return 'go';
  if (/^\s*(?:SELECT|INSERT|UPDATE|DELETE|CREATE\s+TABLE|ALTER\s+TABLE)\b/im.test(code)) return 'sql';
  if (/^(?:\s*(?:sudo|apt|yum|ps|grep|kill|htop|free|df|du|tail|cd|ls|mkdir|rm|cp|mv|git|docker|systemctl|curl|wget|chmod|chown|export)\b)/m.test(code)) return 'bash';
  return 'text';
}

export function remarkNormalizeCodeLanguages() {
  return (tree) => {
    const normalize = (node) => {
      if (!node) return;
      if (node.type === 'code') {
        // 旧文章语言名大小写不统一；缺失标记时只做保守推断，避免误高亮。
        const language = typeof node.lang === 'string'
          ? node.lang.toLowerCase()
          : inferCodeLanguage(node.value);
        node.lang = languageAliases[language] ?? language;
      }
      if (Array.isArray(node.children)) node.children.forEach(normalize);
    };
    normalize(tree);
  };
}
