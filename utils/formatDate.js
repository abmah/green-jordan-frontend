const formatDate = (dateString, locale) => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString(locale, { month: "long" });
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export default formatDate;
