exports.getDefaultResponse = function (req, res, next) {
  res.json(req.data);
};

exports.getListEvents = async function getListEvents(AMI, actionId, lastEvent) {
  let result = [];

  let promise = new Promise((resolve, reject) => {
    let listener = AMI.on('managerevent', f);

    function f(evt) {
      if (evt.actionid === actionId) {
        if (evt.event === lastEvent) {
          listener.removeListener('managerevent', f);
          resolve(result);
        } else {
          result.push(evt);
        }
      }
    }
  });

  return await promise;
};