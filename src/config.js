const isDev = import.meta.env.DEV;

const devBase = "https://localhost:7156";
const prodBase = "https://valternative-server.onrender.com";

export const API_BASE = isDev ? devBase : prodBase;