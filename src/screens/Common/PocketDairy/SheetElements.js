import React from "react";
import { List } from "react-native-paper";

export const SheetElement = ({ current, type }) => {
  switch (type) {
    case "fin-list":
      return (
        <>
          {current?.pck_trans_date && (
            <List.Item title="Date" description={current.pck_trans_date} />
          )}

          {current?.pck_entrytype_name && (
            <List.Item
              title="Entry Type"
              description={current.pck_entrytype_name}
            />
          )}

          {current?.pck_category_name && (
            <List.Item
              title="Category Name"
              description={current.pck_category_name}
            />
          )}

          {current?.pck_sub_category_name && (
            <List.Item
              title="Sub Category Name / Particulars"
              description={current.pck_sub_category_name}
            />
          )}

          {current?.notes && (
            <List.Item title="Notes" description={current.notes} />
          )}

          {current?.pck_mode_name && (
            <List.Item
              title="Reciept Mode / Type"
              description={current.pck_mode_name}
            />
          )}

          {current?.amount && (
            <List.Item title="Amount" description={current.amount} />
          )}

          {current?.employee_code && (
            <List.Item
              title="Employee Code"
              description={current.employee_code}
            />
          )}

          {current?.employee_name && (
            <List.Item
              title="Employee Name"
              description={current.employee_name}
            />
          )}

          {current?.pck_trans_refno && (
            <List.Item
              title="Reference No"
              description={current.pck_trans_refno}
            />
          )}
        </>
      );
  }
};
