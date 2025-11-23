// utils/routeHandlers.js
function createRouteHandler(options) {
    const {
        getDataFn,
        successCode = 200,
        notFoundError = 'Resource not found',
        serverError = 'Failed to fetch resource',
        transformData = null,
        includeCount = false,
        successMessage = null,
        skipNotFoundCheck = false
    } = options;


    return async (req, res) => {
        try {
            const data = await getDataFn(req);

            // Skip not-found check for operations that might not return data
            if ((!skipNotFoundCheck) && (data === null || data === undefined)) {
                return res.status(404).json({
                    success: false,
                    error: notFoundError
                });
            }

            let responseData = data;
            if (transformData) {
                responseData = transformData(data);
            }

            const response = {
                success: true,
                ...(responseData && { data: responseData }),
                ...(successMessage && { message: successMessage })
            };

            if (includeCount && Array.isArray(responseData)) {
                response.count = responseData.length;
            }

            res.status(successCode).json(response);
        } catch (error) {
            console.error('Route handler error:', error);
            res.status(500).json({
                success: false,
                error: serverError
            });
        }
    };
}

module.exports = { createRouteHandler };