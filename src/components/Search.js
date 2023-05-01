import { useState } from "react";
import { Searchbar } from "react-native-paper";
import { Styles } from "../styles/styles";

const Search = ({ data, setData, filterFunction }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const onChangeText = (text) => {
    let searchData = data;
    setSearchQuery(text);
    if (text?.trim()?.length > 0) {
      const filteredData = data?.filter((item) => {
        let temp = false;
        filterFunction.forEach((it) => {
          if (it === "display") {
            const value = item[it] ? "yes" : "no";
            if (value?.includes(text?.trim()?.toLowerCase())) {
              temp = true;
              return;
            }
          } else if (it === "view_status") {
            const value = item[it] === "1" ? "yes" : "no";
            if (value?.includes(text?.trim()?.toLowerCase())) {
              temp = true;
              return;
            }
          } else if (it === "isApprove") {
            const value = item[it] === "1" ? "yes" : "no";
            if (value?.includes(text?.trim()?.toLowerCase())) {
              temp = true;
              return;
            }
          } else if (it === "isPublish") {
            const value = item[it] === "1" ? "yes" : "no";
            if (value?.includes(text?.trim()?.toLowerCase())) {
              temp = true;
              return;
            }
          } else if (it === "employee_active_status") {
            const value = item[it] === "1" ? "yes" : "no";
            if (value?.includes(text?.trim()?.toLowerCase())) {
              temp = true;
              return;
            }
          } else if (it === "reportingAuthority") {
            const value = item[it] === "1" ? "yes" : "no";
            if (value?.includes(text?.trim()?.toLowerCase())) {
              temp = true;
              return;
            }
          } else if (it === "approve_status") {
            const value = item[it] === "1" ? "Approved" : "Not Approved";
            if (value?.includes(text?.trim()?.toLowerCase())) {
              temp = true;
              return;
            }
          } else if (
            item[it]
              ?.toString()
              .toLowerCase()
              ?.includes(text?.trim()?.toLowerCase())
          ) {
            temp = true;
            return;
          }
        });
        return temp;
      });
      setData(filteredData);
    } else {
      setData(searchData);
    }
  };

  return (
    <Searchbar
      style={[Styles.margin16]}
      placeholder="Search"
      onChangeText={onChangeText}
      value={searchQuery}
    />
  );
};

export default Search;
