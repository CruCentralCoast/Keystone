/**
 * Created by imeeder on 3/3/16.
 */

var keystone = require('keystone'),
    express = require('express'),
    router = express.Router();

var MinistryQuestionOption = keystone.list('MinistryQuestionOption').model;

router.route("/")
    .get(function (req, res) {
        MinistryQuestionOption.find({}, 'value').exec(function (err, options) {
            if (err) return res.send(err);
            return res.json(options);
        });
    }).post(function (req, res) {
        MinistryQuestionOption.findOne({ value: req.body.value }).exec(function (err, option) {
            if (err) return res.send(err);
            if (option)
                return res.json(option);
            else {
                MinistryQuestionOption.create({
                    value: req.body.value
                }, function (err, option) {
                    if (err) return res.send(err);
                    return res.json(option);
                });
            }
        });
    });

module.exports = router;
