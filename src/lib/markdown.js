/**
 * A simple, lightweight Markdown to HTML parser for blog rendering.
 * Avoids native module compile issues and remains highly portable.
 */
export function parseMarkdown(markdown) {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  let html = [];
  let inList = false;
  let inCodeBlock = false;
  let codeBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Handle code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        html.push(`<pre class="bg-gray-100 dark:bg-gray-900/60 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-gray-200/50 dark:border-gray-850 my-4"><code>${codeBuffer.join('\n')}</code></pre>`);
        codeBuffer = [];
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      // Escape HTML entities inside code block
      const escaped = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      codeBuffer.push(escaped);
      continue;
    }

    // Handle unordered list items
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      if (!inList) {
        inList = true;
        html.push('<ul class="list-disc pl-6 space-y-2 my-4 text-xs sm:text-sm font-medium text-gray-705 dark:text-gray-300">');
      }
      const listContent = processInlineStyles(line.trim().substring(2));
      html.push(`<li>${listContent}</li>`);
      continue;
    } else {
      if (inList) {
        inList = false;
        html.push('</ul>');
      }
    }

    const trimmed = line.trim();
    if (trimmed === '') {
      continue;
    }

    // Handle Headings
    if (trimmed.startsWith('# ')) {
      const content = processInlineStyles(trimmed.substring(2));
      html.push(`<h1 class="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white mt-8 mb-4 tracking-tight">${content}</h1>`);
    } else if (trimmed.startsWith('## ')) {
      const content = processInlineStyles(trimmed.substring(3));
      html.push(`<h2 class="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white mt-6 mb-3 tracking-tight">${content}</h2>`);
    } else if (trimmed.startsWith('### ')) {
      const content = processInlineStyles(trimmed.substring(4));
      html.push(`<h3 class="text-lg sm:text-xl font-bold text-gray-950 dark:text-white mt-5 mb-2">${content}</h3>`);
    } else {
      // Standard Paragraph
      const content = processInlineStyles(trimmed);
      html.push(`<p class="text-xs sm:text-sm font-medium text-gray-705 dark:text-gray-300 leading-relaxed my-4">${content}</p>`);
    }
  }

  // Close lists if we ended on one
  if (inList) {
    html.push('</ul>');
  }

  return html.join('\n');
}

function processInlineStyles(text) {
  if (!text) return '';

  let result = text
    // Escape HTML characters to prevent XSS (optional/basic)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Bold text (**bold**)
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-gray-950 dark:text-white">$1</strong>')
    // Code ticks (`code`)
    .replace(/`(.*?)`/g, '<code class="bg-gray-150 dark:bg-gray-900 px-1 py-0.5 rounded font-mono text-xs text-blue-600 dark:text-blue-400">$1</code>')
    // Links [text](url) -> nofollow compliant
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" rel="nofollow sponsored" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5 font-bold">$1</a>');

  return result;
}
