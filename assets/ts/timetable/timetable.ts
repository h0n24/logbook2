import { generateICalFromSchedule } from "./_generateICal";
import { getTableData } from "./_getTableData";
import { hideEmptyRows } from "./_hideEmpty";

// add right click to menu
export function timetable() {
  // needs small timeout because angular firstly
  // adds and after that removes previous rows
  // so it would count previous rows as present
  setTimeout(function () {
    try {
      hideEmptyRows();

      getTableData();

      generateICalFromSchedule();
    } catch (error) {}
  }, 100);
}
