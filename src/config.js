const isDev = import.meta.env.DEV;

const devBase = "http://localhost:5158";
const prodBase = "https://nicenice-server-yo96.onrender.com";

export const API_BASE = isDev ? devBase : prodBase;