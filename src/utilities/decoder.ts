export function decodeHtmlText(
    str: string
): string {
    return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\u00a0/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}