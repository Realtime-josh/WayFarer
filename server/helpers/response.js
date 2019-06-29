const sendResponse = (res, status, data, error) => {
  res.status(status).send({
    status,
    data: data || undefined,
    error: error || undefined,
  });
};

export default sendResponse;
