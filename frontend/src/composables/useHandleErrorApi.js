export default function useHandleErrorApi() {
  const handleError = (err, checkItemsResponse = false) => {
    if (!err.response || !err.response.data) {
      return "Unknown error occurred.";
    }

    const data = err.response.data;
    const errorFields = [
      "detail",
      "name",
      "surnames",
      "password",
      "email",
      "password",
      "refresh",
    ];

    if (checkItemsResponse) {
      return "You must fill out all the required fields and make sure they are not empty.";
    }

    for (let field of errorFields) {
      if (data[field]) {
        return Array.isArray(data[field]) ? data[field][0] : data[field];
      }
    }

    return "An unexpected error occurred.";
  };

  return { handleError };
}
