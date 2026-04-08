export function showMessage(
    text: string,
    type: 'info' | 'error' = 'info'
): void {
    const el = document.querySelector<HTMLParagraphElement>('#message');

    if (!el) return; 

    el.textContent = text;
    el.className = `message ${type}`;
}