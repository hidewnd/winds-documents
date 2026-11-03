import assert from 'node:assert/strict';
import { test } from 'node:test';
import { markdownProcessor } from '../src/plugins/markdown.mjs';

// 复用站点的真实插件顺序；Expressive Code 的最终输出另由完整构建与浏览器验收覆盖。
const renderer = await markdownProcessor.createRenderer({ syntaxHighlight: false });

test('行内公式与块级公式生成 HTML 和 MathML', async () => {
  const { code } = await renderer.render(String.raw`行内 $E = mc^2$。

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$`);
  assert.equal((code.match(/class="katex"/g) ?? []).length, 2);
  assert.equal((code.match(/class="katex-display"/g) ?? []).length, 1);
  assert.equal((code.match(/<math\b/g) ?? []).length, 2);
  assert.match(code, /class="katex-html" aria-hidden="true"/);
  assert.doesNotMatch(code, /katex-error|<pre>|<code/);
});

test('math 围栏和表格内公式得到排版', async () => {
  const { code } = await renderer.render('```math\n\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}\n```\n\n| 参数 | 值 |\n| --- | --- |\n| $N$ | $2^8$ |');
  assert.equal((code.match(/class="katex"/g) ?? []).length, 3);
  assert.match(code, /class="katex-display"/);
  assert.match(code, /<td><span class="katex"/);
  assert.doesNotMatch(code, /katex-error|language-math|<pre>/);
});

test('Mermaid 保留中文及特殊字符，以文本容器避开代码高亮', async () => {
  const { code } = await renderer.render('```Mermaid\nflowchart LR\nA["输入 <script> & $N$"] --> B[完成]\n```');
  assert.match(code, /<pre class="mermaid">flowchart LR/);
  assert.match(code, /输入 &#x3C;script> &#x26; \$N\$/);
  assert.match(code, /--> B\[完成\]/);
  assert.doesNotMatch(code, /<script|<code|class="katex"|expressive-code/);
});

test('普通代码和转义美元符号保持原样', async () => {
  const { code } = await renderer.render('`$E=mc^2$` 与价格 \\$5、\\$10。\n\n```python\nprint("$x$ <script>")\n```\n\n```markdown\n```mermaid\n```');
  assert.match(code, /<code>\$E=mc\^2\$<\/code>/);
  assert.match(code, /价格 \$5、\$10/);
  assert.match(code, /<pre><code class="language-python">/);
  assert.match(code, /print\("\$x\$ &#x3C;script>"\)/);
  assert.doesNotMatch(code, /class="katex"|class="mermaid"/);
});

test('无效公式保留可见错误和原文，不阻止后续公式', async () => {
  const { code } = await renderer.render('$\\frac{1}{$\n\n正常 $x^2$');
  assert.match(code, /class="katex-error"/);
  assert.match(code, /title="ParseError:/);
  assert.match(code, /\\frac\{1\}\{/);
  assert.match(code, /正常 <span class="katex">/);
});

test('多图表及提示块内的图表独立保留', async () => {
  const { code } = await renderer.render('```mermaid\nflowchart LR\nA-->B\n```\n\n:::tip\n```mermaid\nsequenceDiagram\n甲->>乙: 你好\n```\n:::');
  assert.equal((code.match(/<pre class="mermaid">/g) ?? []).length, 2);
  assert.match(code, /<aside[^>]*admonition-tip/);
  assert.match(code, /甲->>乙: 你好/);
});

test('扩展公式与图表不放开原文脚本、事件属性或危险链接', async () => {
  const { code } = await renderer.render('<script>alert(1)</script>\n\n<style>body { display: none }</style>\n\n<img src="x" onerror="alert(1)">\n\n[链接](javascript:alert)\n\n$\\htmlClass{unsafe}{x}$\n\n正常 $x$');
  assert.doesNotMatch(code, /<script|<style|onerror|javascript:|class="unsafe"/);
  assert.match(code, /<a>链接<\/a>/);
  assert.match(code, /正常 <span class="katex">/);
});
