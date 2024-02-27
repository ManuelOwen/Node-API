// factory functions
export const handleValidationErrors = (error, res) => {
      res.status(400).json({
          error: error.details[0].message,
      });
  };
  
  export const handlePassingParamsError = (error, res) => {
      res.status(400).json({
          error: "Missing URL parameter",
      });
  };
  
  export const handleServerError = (error, res) => {
      res.status(500).json({
          error: `Internal Server Error: ${error.message}`,
      });
  };
  
  // try-catch wrapper
  export const tryCatchWrapper = async (handler, req, res) => {
      try {
          await handler(req, res);
      } catch (error) {
          handleServerError(error, res);
      }
  };
  
  // user factory functions
  export const handlePasswordRequired = (res) => {
      res.status(400).json({
          message: "Password required",
      });
  };
  
  export const handleInvalidUser = (res) => {
      res.status(401).json({
          message: "User account not found. Contact help center",
      });
  };
  
  export const handleUserNotFound = (res) => {
      res.status(401).json({
          message: "Wrong credentials",
      });
  };
  
  export const handleUserExists = (res) => {
      res.status(409).json({
          message: "User already exists. Choose a unique name or email",
      });
  };
  
  export const handleUserNotCreated = (res) => {
      res.status(500).json({
          message: "Error while creating user",
      });
  };
  
  export const handleUserNotUpdated = (res) => {
      res.status(501).json({
          message: "Error while updating user",
      });
  };
  
  export const handleUserNotDeleted = (res) => {
      res.status(502).json({
          message: "Error while deleting user",
      });
  };
  