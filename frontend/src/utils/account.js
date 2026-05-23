export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return '****';
  const visible = accountNumber.slice(-4);
  return `****${visible}`;
};