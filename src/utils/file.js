
export const formatSize = (size)=> {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    
    for (let i = 0; i < units.length; i++) {
        if (size < 1024) {
            return `${size.toFixed(2)} ${units[i]}`;
        }
        size /= 1024;
    }
    
    return `${size.toFixed(2)} PB`;
}
