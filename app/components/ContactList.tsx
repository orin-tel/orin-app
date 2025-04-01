import React from "react";
import { SectionList, StyleSheet, Text } from "react-native";

interface Contact {
  firstName: string;
  lastName: string;
}

interface Section {
  title: string;
  data: Contact[];
}

const contacts: Section[] = [
  { title: "A", data: [{ firstName: "John", lastName: "Aaron" }] },
  {
    title: "D",
    data: [
      { firstName: "John", lastName: "Doe" },
      { firstName: "Mary", lastName: "Dianne" },
    ],
  },
];

const ContactsSectionList = () => {
  return (
    <SectionList
      sections={contacts}
      renderItem={({ item }) => {
        return <Text>{item.firstName}</Text>;
      }}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.header}>{title}</Text>
      )}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
  },
});