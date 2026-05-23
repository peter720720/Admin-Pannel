export const generateAccountNumber = () => {
  // 10 digit account number starting with 2 for "MyBank"
  const prefix = '2';
  const random = Math.floor(Math.random() * 1000000).toString().padStart(9, '0');
  return prefix + random;
};

export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return '****';
  const visible = accountNumber.slice(-4);
  return `****${visible}`;
};