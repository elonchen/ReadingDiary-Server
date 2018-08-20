/**
 * Created by LSD on 16/7/2.
 */
var API_NO_ERROR = 0;

exports.result = function (data = {}, error = API_NO_ERROR, msg = 'SUCCESS') {
    var result = {};
    result.error = error;
    result.msg = msg;
    result.data = data;
    return result;
}
