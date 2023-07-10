import { customAlphabet } from "nanoid";
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Define your coupon code character set
const generateCouponCode = customAlphabet(alphabet, 8); // Generate an 8-character coupon code

export const uniqueCouponCode = generateCouponCode();
