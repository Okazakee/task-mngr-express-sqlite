require('dotenv').config({ path: '../.env.local' });

export const jwtSecret = process.env.JWT_SECRET;
export const production = process.env.PRODUCTION;
export const localhost = process.env.LOCAL_HOST_URL;
export const exposed = process.env.EXPOSED_HOST_URL;