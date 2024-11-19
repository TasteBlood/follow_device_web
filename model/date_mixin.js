module.exports = {
    /**
     * 获取完成的年月日时分秒 yyyy-MM-dd HH:mm:ss
     * @returns {string}
     */
    fullDateTime(){
        const year = this.getFullYear();
        const month = String(this.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需加1
        const day = String(this.getDate()).padStart(2, "0");
        const hours = String(this.getHours()).padStart(2, "0");
        const minutes = String(this.getMinutes()).padStart(2, "0");
        const seconds = String(this.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    /**
     * 获取完成的年月日 yyyy-MM-dd
     * @returns {string}
     */
    fullDate(){
        const year = this.getFullYear();
        const month = String(this.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需加1
        const day = String(this.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }
};