"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTableData = getTableData;
var _generateICal = require("./_generateICal");
var _getTableData = require("./_getTableData");
// add right click to menu
function getTableData() {
  // needs small timeout because angular firstly
  // adds and after that removes previous rows
  // so it would count previous rows as present
  setTimeout(function () {
    try {
      (0, _getTableData.findAllTdThatHaveLessonItem)();
      (0, _generateICal.generateICalFromSchedule)();
    } catch (error) {}
  }, 100);
}