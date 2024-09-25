import { Md } from "slack-block-builder";
export const getUserList = async (client) => {
  return await client.users.list();
};

export const convertUserFromText = (text) => {
  const parts = text.split(/(\s+)/).map((part) => {
    if (part.startsWith("@")) {
      const username = part.slice(1); // Remove the "@" symbol
      return Md.user(`${username}`); // Call the Md.user method
    }
    return part; // Return the non-mention parts as-is
  });
  return parts.join("");
};
