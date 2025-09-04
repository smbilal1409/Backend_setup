import asynchandlerfunction from "../utils/asynchandler.js";
import ApiError from "../utils/Apierror.js";
import ApiResponse from "../utils/Apiresponse.js";
const healthcheck = asynchandlerfunction(async (req, res) => {
    return res.status(200)
    .json(new ApiResponse(200,{status:"ok"},"everything works correctly"));
})
export{healthcheck}