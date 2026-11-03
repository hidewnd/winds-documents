function walk(node) {
  if (!Array.isArray(node.children)) return;

  const code = node.children[0];
  if (
    node.tagName === 'pre' && node.children.length === 1 &&
    code.type === 'element' && code.tagName === 'code' &&
    code.properties.className?.includes('language-mermaid')
  ) {
    // 保留文本节点，让序列化器转义源码；去掉 code 包装，避免被 Expressive Code 当成普通代码。
    node.properties.className = [...(node.properties.className ?? []), 'mermaid'];
    node.children = code.children;
    return;
  }

  node.children.forEach(walk);
}

export function rehypeMermaid() {
  return (tree) => walk(tree);
}
