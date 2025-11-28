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
            if ((!skipNotFoundCheck) && (data === null || data === undefined || data.length === 0)) {
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
                error: serverError,
                error_message: error.message
            });
        }
    };
}

function extractTokenFromRequest(req) {
    // 1. Získání hlavičky Authorization
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        // Hlavička Authorization chybí
        return null;
    }

    // 2. Kontrola formátu (očekává se 'Bearer <token>')
    const parts = authHeader.split(' ');

    if (parts.length === 2 && parts[0] === 'Bearer') {
        // Vracíme samotný token (druhá část pole)
        return authHeader;
        // POZNÁMKA: Vracíme celý řetězec "Bearer <token>", protože je nutný pro hlavičku Axiosu
    }

    // Pokud je token jen samotný řetězec bez "Bearer"
    if (parts.length === 1) {
        return authHeader;
    }

    // Chybný formát
    return null;
}

module.exports = { createRouteHandler, extractTokenFromRequest };