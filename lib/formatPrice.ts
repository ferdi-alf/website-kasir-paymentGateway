export const formatPrice = (value: number | string) => {
  const num =
    typeof value === "string" ? parseInt(value.replace(/\D/g, ""), 10) : value;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
