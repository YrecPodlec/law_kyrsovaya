export const casePaths = (number: string) => {
  const overview = `/cases/${encodeURIComponent(number)}`;
  return { overview, documents: `${overview}/documents`, mail: `${overview}/mail` };
};
