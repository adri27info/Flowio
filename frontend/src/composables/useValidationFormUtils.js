export function useValidationFormUtils() {
  const validations = {
    email: "Enter a valid email address.",
    requiredFields: "You must fill out all the fields required.",
    empty: "cannot be empty.",
    password: {
      length: "Password must be between 8 and 20 characters long.",
      uppercase: "Password must contain at least one uppercase letter.",
      number: "Password must contain at least one number.",
      specialChar: "Password must contain at least one special character.",
    },
    profileImage: {
      size: "The file must not exceed 5 MB.",
      type: "Only JPG and PNG images are allowed.",
      sizeLimit: 5 * 1024 * 1024,
      typeImage: ["image/jpeg", "image/png"],
    },
    form: {
      image:
        "You have to correct the image upload validations if you want to upload it.",
      requiredFields: "You must fill out all the fields required.",
    },
  };

  const formData = {
    email: "",
    password: "",
    name: "",
    title: "",
    surnames: "",
    description: "",
    background_workspace_id: "",
    workspace_id: "",
    structure_id: "",
  };

  const formErrors = {
    email: "",
    password: "",
    form: "",
    name: "",
    title: "",
    surnames: "",
    description: "",
    background_workspace_id: "",
    workspace_id: "",
    structure_id: "",
  };

  return {
    validations,
    formData,
    formErrors,
  };
}
