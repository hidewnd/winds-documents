const unsafeRawBlock = /<\/?(?:script|style)\b/i;

function clean(node) {
  if (!node || !Array.isArray(node.children)) return;

  node.children = node.children.filter((child) => {
    // 先整体移除旧 Vue 脚本和主题样式，再由 rehype-sanitize 过滤属性与协议。
    if (child.type === 'element' && ['script', 'style'].includes(child.tagName)) {
      return false;
    }
    if (child.type === 'raw' && unsafeRawBlock.test(child.value ?? '')) {
      return false;
    }
    return true;
  });

  for (const child of node.children) clean(child);
}

export function rehypeRemoveUnsafeHtml() {
  return (tree) => clean(tree);
}
