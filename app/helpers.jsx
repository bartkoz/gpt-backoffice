export const convertHosts = (domains) => {
  return domains.map((obj) => obj.host).join(", ");
};
