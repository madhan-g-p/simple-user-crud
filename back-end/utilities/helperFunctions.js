
const logErr = (err) => import('serialize-error').then(({ serializeError }) => serializeError(err))

const statusCodes = {
	200: "SUCCESS",
	201: "CREATED",
	203: "NON AUTHORITATIVE INFORMATION",
	204: "NO CONTENT",
	400: "BAD REQUEST",
	401: "UNAUTHORIZED",
	403: "FORBIDDEN",
	405: "METHOD NOT ALLOWED",
	406: "NOT ACCEPTABLE",
	409: "CONFLICT",
	415: "UNSUPPORTED",
	500: "SERVER ERROR",
};

const globalErrorHandler = async (error, req, res, next) => {
	//console.log('common handler',await logErr(error))

	const { statusCode = 500, message = 'errored', path, detail = "Internal Server Error" } = await logErr(error);
	return sendRes(res, statusCode, path, detail, null)
}

const sendRes = (res, status, desc, detail, asset) => {
	let resObj = {};

	resObj.msg = statusCodes[status] || null;
	resObj.desc = desc;
	resObj.detail = detail;
	resObj.asset = asset;
	if (status > 399)
		console.log("************** resObj = \n", resObj, "\n\n");

	return res.status(status).send(resObj);
};

const finalValidator = (validatorFunction,options={abortEarly:false}) => {
	return (req, res, next) => {
		let validatorResponse = validatorFunction.validate({...req.body,...req.params,...req.query},options);
		if (validatorResponse.error) {
			next({
				message: "Mandatory Payload Fields doesn't meet the requirement",
				statusCode: 406,
				detail: validatorResponse.error.details.reduce((acc, err) => ({ ...acc, [err.path[0]]: err.message }), {}),
				path: req.originalUrl,
			})
		} else {
			next();
		}
	}
}

const convertUnderScoresToCamelCase = (obj) => {

	if (obj !== null)
		switch (typeof obj) {
			case "object":

				return Object.entries(obj).reduce((acc, [key, value]) => {
					let newKey = key.split("_").reduce((currKey, keyAcc) => currKey + keyAcc.charAt(0).toUpperCase() + keyAcc.slice(1));

					return { ...acc, [newKey]: value }
				}, {});

			case "string":
				return obj.split("_").reduce((currKey, keyAcc) => currKey + keyAcc.charAt(0).toUpperCase() + keyAcc.slice(1));
		}
};

const convertCamelCaseToSnakeCase = (obj) => {

	if (obj !== null)
		switch (typeof obj) {
			case "object":
				return Object.entries(obj).reduce((acc, [key, value]) => {
					let newKey = key.split(/\.?(?=[A-Z])/).join('_').toLowerCase();
					return { ...acc, [newKey]: value }
				}, {});

			case "string":
				return obj.split(/\.?(?=[A-Z])/).join('_').toLowerCase();
		}
};

module.exports = {
	globalErrorHandler, sendRes,
	finalValidator, convertCamelCaseToSnakeCase,
	convertUnderScoresToCamelCase
}