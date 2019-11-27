const ERROR_MESSAGES = {
  request_error: "try again later or contact the administrator",
  generic: "try again later or contact the administrator"
};

const getErrorMessage = (err = {}) => {
  const { code = "", description } = err;
  const messageFromApp = err ? ERROR_MESSAGES[code] : ERROR_MESSAGES.generic;
  let messageToUse;
  
  try {
    // in case its JSON description use messageFromApp
    JSON.parse(description);
    messageToUse = messageFromApp;
  } catch(e) {
    messageToUse = typeof description === "string" ? description : undefined;
  }
  return messageToUse || ERROR_MESSAGES.generic;
};

export default getErrorMessage;