

export const normalizeUrl = (url) => {
    if (!url) return '/';
    if (!url.startsWith('/')) url = '/' + url;
    if (url.length > 1 && url.endsWith('/')) url = url.slice(0, -1);
    return url;
};

export function findMenuByUrl(menus, url) {
    const normalizedTarget = normalizeUrl(url)
    for (const menu of menus) {
        if (normalizeUrl(menu.menu_url) === normalizedTarget) return menu
        if (Array.isArray(menu.childs)) {
            const found = findMenuByUrl(menu.childs, url);
            if (found) return found;
        }
    }
    return null;
}