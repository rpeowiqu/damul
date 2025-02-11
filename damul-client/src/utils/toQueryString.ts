const toQueryString = (params: Record<string, string | number | boolean>) => {
  return new URLSearchParams(
    Object.entries(params).reduce(
      (acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>,
    ),
  ).toString();
};

export default toQueryString;
